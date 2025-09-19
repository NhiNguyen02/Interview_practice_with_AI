import os
import json
import requests
import time
import logging
from datetime import datetime, timedelta
from app.database import InterviewSession, InterviewQuestion, InterviewAnswer

logger = logging.getLogger(__name__)

def generate_question(prompt: str) -> str:
    """Generate interview question using Gemini API, optimized for interview practice."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY not found in environment variables")
        raise ValueError("GEMINI_API_KEY not found in environment variables")

    try:
        endpoint = (
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
        )
        
        # Prompt được tối ưu cho luyện phỏng vấn
        enhanced_prompt = f"""
Bạn là một chuyên gia phỏng vấn giàu kinh nghiệm. Hãy tạo ra một câu hỏi phỏng vấn phù hợp với ngữ cảnh sau:

{prompt}

Yêu cầu:
- Câu hỏi phải rõ ràng, dễ hiểu và phù hợp với vị trí ứng tuyển
- Tập trung vào kỹ năng thực tế và kinh nghiệm làm việc
- Độ khó phù hợp với mức kinh nghiệm
- Câu hỏi mở để ứng viên có thể trình bày chi tiết
- Phù hợp với văn hóa doanh nghiệp Việt Nam

Chỉ trả về câu hỏi, không cần giải thích thêm.
"""
        
        payload = {"contents": [{"parts": [{"text": enhanced_prompt}]}]}
        
        logger.info(f"Calling Gemini API with prompt length: {len(enhanced_prompt)}")
        logger.info(f"API Endpoint: {endpoint}")
        
        resp = requests.post(endpoint, params={"key": api_key}, json=payload, timeout=30)
        
        logger.info(f"Gemini API response status: {resp.status_code}")
        
        if not resp.ok:
            logger.error(f"Gemini API error: {resp.status_code} - {resp.text}")
            raise RuntimeError(f"Gemini API returned {resp.status_code}: {resp.text}")
        
        data = resp.json()
        logger.info(f"Gemini API response structure: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
        
        if "candidates" not in data or not data["candidates"]:
            logger.error(f"Unexpected Gemini API response format: {data}")
            raise RuntimeError("Unexpected response format from Gemini API")
        
        question_text = data["candidates"][0]["content"]["parts"][0]["text"]
        
        # Làm sạch text từ AI
        question_text = question_text.strip()
        if question_text.startswith('"') and question_text.endswith('"'):
            question_text = question_text[1:-1]
        
        logger.info(f"Generated question: {question_text[:100]}...")
        return question_text
        
    except requests.exceptions.Timeout:
        logger.error("Gemini API request timed out")
        raise RuntimeError("Request to Gemini API timed out. Please try again.")
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to Gemini API")
        raise RuntimeError("Failed to connect to Gemini API. Please check your internet connection.")
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {e}")
        raise RuntimeError(f"Network error: {e}")
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        raise RuntimeError("Invalid response from Gemini API")
    except KeyError as e:
        logger.error(f"Missing key in response: {e}")
        raise RuntimeError("Unexpected response format from Gemini API")
    except Exception as e:
        logger.error(f"Unexpected error generating question: {e}")
        raise RuntimeError(f"Error generating question: {e}")


def evaluate_audio_answer(question_text: str, audio_url: str) -> dict:
    """Transcribe audio with AssemblyAI then evaluate using Gemini."""
    assembly_key = os.getenv("ASSEMBLYAI_API_KEY")
    if not assembly_key:
        raise RuntimeError("ASSEMBLYAI_API_KEY not configured")

    headers = {"authorization": assembly_key, "content-type": "application/json"}
    transcript_endpoint = "https://api.assemblyai.com/v2/transcript"

    # Start transcription
    logger.info("📤 Sending audio to AssemblyAI for transcription")
    start_payload = {
        "audio_url": audio_url,
        "language_code": "vi",  # Force Vietnamese transcription
    }
    start_resp = requests.post(transcript_endpoint, json=start_payload, headers=headers)
    if not start_resp.ok:
        logger.error(f"❌ AssemblyAI error: {start_resp.status_code} - {start_resp.text}")
        raise RuntimeError(f"AssemblyAI returned {start_resp.status_code}: {start_resp.text}")

    transcript_id = start_resp.json()["id"]

    # Poll for completion
    logger.info(f"⌛ Waiting for AssemblyAI transcript {transcript_id}")
    while True:
        poll_resp = requests.get(f"{transcript_endpoint}/{transcript_id}", headers=headers)
        if not poll_resp.ok:
            logger.error(f"❌ AssemblyAI polling error: {poll_resp.status_code} - {poll_resp.text}")
            raise RuntimeError(f"AssemblyAI polling returned {poll_resp.status_code}: {poll_resp.text}")
        poll_data = poll_resp.json()
        status = poll_data.get("status")
        if status == "completed":
            transcript_text = poll_data.get("text", "")
            logger.info("✅ AssemblyAI transcription completed")
            break
        if status == "error":
            error_msg = poll_data.get("error", "unknown error")
            logger.error(f"❌ AssemblyAI transcription failed: {error_msg}")
            raise RuntimeError(f"AssemblyAI transcription failed: {error_msg}")
        time.sleep(3)

    # Evaluate transcript with Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY not configured; returning fallback with transcript only")
        return {
            "transcript_text": transcript_text,
            "score": 0,
            "breakdown": {"speaking": 0, "content": 0, "relevance": 0},
            "feedback": "",
            "strengths": [],
            "improvements": [],
        }

    endpoint = (
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
    )

    prompt = f"""
Bạn là một chuyên gia phỏng vấn. Đánh giá câu trả lời của ứng viên dựa trên câu hỏi.
Áp dụng mô hình STAR (Situation, Task, Action, Result) để đánh giá mức độ đầy đủ, logic và tính thuyết phục. 
Đặc biệt ưu tiên mô tả rõ ràng phần Action (hành động cá nhân) và nêu rõ Result có số liệu minh chứng nếu có.

Câu hỏi: {question_text}
Câu trả lời: {transcript_text}

Yêu cầu:
- Chấm điểm tổng thể theo thang 0-10.
- Chấm chi tiết theo 3 tiêu chí (0-10): speaking, content, relevance.
- Đánh giá theo khung STAR; nêu nhận xét ngắn gọn trong "feedback" về từng thành phần S/T/A/R (đầy đủ hay thiếu; mạnh hay yếu).
- Nếu thiếu phần nào của STAR, đề xuất cách bổ sung cụ thể trong "improvements" (ví dụ: nêu rõ bối cảnh, mục tiêu, hành động cụ thể, kết quả định lượng...).
- Ưu tiên chấm Content và Relevance dựa trên mức độ đầy đủ của STAR; Speaking dựa trên sự mạch lạc, rõ ràng, logic trình bày.

BẮT BUỘC TRẢ VỀ JSON HỢP LỆ, ĐÚNG CHUẨN, KHÔNG THÊM GIẢI THÍCH, VỚI CẤU TRÚC:
{{
  "transcript": "{transcript_text}",
  "score": 8.5, (điểm trung bình của 3 tiêu chí breakdown)
  "breakdown": {{
    "speaking": 8.0,
    "content": 9.0,
    "relevance": 8.5
  }},
  "feedback": "feedback ngắn gọn về câu trả lời, kèm nhận xét theo STAR (S/T/A/R)",
  "strengths": ["điểm mạnh 1", "điểm mạnh 2", "điểm mạnh 3"],
  "improvements": ["điểm cần cải thiện 1 (bổ sung STAR)", "điểm cần cải thiện 2", "điểm cần cải thiện 3"]
}}

Lưu ý: Chỉ trả về JSON thuần túy, không bọc trong markdown code blocks, không thêm text nào khác.
"""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    logger.info("📤 Sending evaluation request to Gemini")
    try:
        resp = requests.post(endpoint, params={"key": api_key}, json=payload, timeout=60)
        if not resp.ok:
            logger.error(f"❌ Gemini API error: {resp.status_code} - {resp.text}")
            raise RuntimeError(f"Gemini API returned {resp.status_code}: {resp.text}")

        data = resp.json()
        if "candidates" not in data or not data["candidates"]:
            logger.error(f"❌ No candidates in Gemini response: {data}")
            raise RuntimeError("No candidates in Gemini response")

        text = data["candidates"][0]["content"]["parts"][0]["text"]
        cleaned_text = text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text.replace("```json", "").replace("```", "").strip()
        elif cleaned_text.startswith("```"):
            cleaned_text = cleaned_text.replace("```", "").strip()

        logger.info(f"🧹 Cleaned text for JSON parsing: {cleaned_text[:200]}...")
        parsed = json.loads(cleaned_text)
        logger.info(
            f"✅ Gemini evaluation JSON: {json.dumps(parsed, indent=2, ensure_ascii=False)}"
        )
        return parsed
    except Exception as e:
        logger.error(f"❌ Gemini evaluation failed, using fallback transcript: {e}")
        return {
            "transcript_text": transcript_text,
            "score": 0,
            "breakdown": {"speaking": 0, "content": 0, "relevance": 0},
            "feedback": "",
            "strengths": [],
            "improvements": [],
        }

def evaluate_text_answer(question_text: str, transcript_text: str) -> dict:
    """Evaluate a text answer directly using Gemini API."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not configured")

    endpoint = (
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
    )

    prompt = f"""
Bạn là một chuyên gia phỏng vấn. Đánh giá câu trả lời của ứng viên dựa trên câu hỏi.
Áp dụng mô hình STAR (Situation, Task, Action, Result) để đánh giá mức độ đầy đủ, logic và tính thuyết phục. 
Đặc biệt ưu tiên mô tả rõ ràng phần Action (hành động cá nhân) và nêu rõ Result có số liệu minh chứng nếu có.

Câu hỏi: {question_text}
Câu trả lời: {transcript_text}

Yêu cầu:
- Chấm điểm tổng thể theo thang 0-10.
- Chấm chi tiết theo 3 tiêu chí (0-10): speaking, content, relevance.
- Đánh giá theo khung STAR; nêu nhận xét ngắn gọn trong "feedback" về từng thành phần S/T/A/R (đầy đủ hay thiếu; mạnh hay yếu).
- Nếu thiếu phần nào của STAR, đề xuất cách bổ sung cụ thể trong "improvements" (ví dụ: nêu rõ bối cảnh, mục tiêu, hành động cụ thể, kết quả định lượng...).
- Ưu tiên chấm Content và Relevance dựa trên mức độ đầy đủ của STAR; Speaking dựa trên sự mạch lạc, rõ ràng, logic trình bày.

BẮT BUỘC TRẢ VỀ JSON HỢP LỆ, ĐÚNG CHUẨN, KHÔNG THÊM GIẢI THÍCH, VỚI CẤU TRÚC:
{{
  "transcript": "{transcript_text}",
  "score": 8.5,
  "breakdown": {{
    "speaking": 8.0,
    "content": 9.0,
    "relevance": 8.5
  }},
  "feedback": "feedback ngắn gọn về câu trả lời, kèm nhận xét theo STAR (S/T/A/R)",
  "strengths": ["điểm mạnh 1", "điểm mạnh 2", "điểm mạnh 3"],
  "improvements": ["điểm cần cải thiện 1 (bổ sung STAR)", "điểm cần cải thiện 2", "điểm cần cải thiện 3"]
}}

Lưu ý: Chỉ trả về JSON thuần túy, không bọc trong markdown code blocks, không thêm text nào khác.
"""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    logger.info("📤 Sending evaluation request to Gemini (text)")
    resp = requests.post(endpoint, params={"key": api_key}, json=payload, timeout=60)

    if not resp.ok:
        logger.error(f"❌ Gemini API error: {resp.status_code} - {resp.text}")
        raise RuntimeError(f"Gemini API returned {resp.status_code}: {resp.text}")

    data = resp.json()
    if "candidates" not in data or not data["candidates"]:
        logger.error(f"❌ No candidates in Gemini response: {data}")
        raise RuntimeError("No candidates in Gemini response")

    text = data["candidates"][0]["content"]["parts"][0]["text"]
    cleaned_text = text.strip()
    if cleaned_text.startswith("```json"):
        cleaned_text = cleaned_text.replace("```json", "").replace("```", "").strip()
    elif cleaned_text.startswith("```"):
        cleaned_text = cleaned_text.replace("```", "").strip()

    logger.info(f"🧹 Cleaned text for JSON parsing: {cleaned_text[:200]}...")
    parsed = json.loads(cleaned_text)
    logger.info(
        f"✅ Gemini evaluation JSON: {json.dumps(parsed, indent=2, ensure_ascii=False)}"
    )
    return parsed


def summarize_transcript(transcript: list[dict], session: InterviewSession | None = None) -> str:
    """Summarize the interview transcript using Gemini API with focus on learning outcomes."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY not found in environment variables")
        raise ValueError("GEMINI_API_KEY not found in environment variables")

    try:
        endpoint = (
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
        )
        
        conversation = "\n".join(
            f"Câu hỏi {i+1}: {t.get('question','')}\nTrả lời: {t.get('answer','')}\nĐiểm: {t.get('score', 0)}/10\nPhản hồi: {t.get('feedback','')}\n"
            for i, t in enumerate(transcript)
        )
        
        # Prompt tóm tắt tập trung vào kết quả học tập
        summary_prompt = f"""
Bạn là một chuyên gia tư vấn nghề nghiệp. Hãy tóm tắt buổi phỏng vấn luyện tập này:

Thông tin phiên phỏng vấn:
- Vị trí: {session.role if session else 'N/A'} - {session.position if session else 'N/A'}
- Lĩnh vực: {session.field if session else 'N/A'} / {session.specialization if session else 'N/A'}
- Kinh nghiệm: {session.experience_level if session else 'N/A'}

Nội dung phỏng vấn:
{conversation}

Hãy tóm tắt:
1. **Tổng quan**: Đánh giá tổng thể về buổi phỏng vấn
2. **Điểm mạnh**: Những điểm tốt của ứng viên
3. **Điểm cần cải thiện**: Những lĩnh vực cần phát triển
4. **Khuyến nghị**: Gợi ý cụ thể để cải thiện kỹ năng phỏng vấn
5. **Đánh giá tổng thể**: Xếp loại từ A+ đến D

Trả về tóm tắt bằng tiếng Việt, ngắn gọn nhưng đầy đủ thông tin.
"""
        
        payload = {"contents": [{"parts": [{"text": summary_prompt}]}]}
        resp = requests.post(endpoint, params={"key": api_key}, json=payload, timeout=30)
        
        logger.info(f"Gemini API summary response status: {resp.status_code}")
        
        if not resp.ok:
            logger.error(f"Gemini API summary error: {resp.status_code} - {resp.text}")
            raise RuntimeError(f"Gemini API returned {resp.status_code}: {resp.text}")
        
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
        
    except requests.exceptions.Timeout:
        logger.error("Gemini API summary request timed out")
        raise RuntimeError("Request to Gemini API timed out. Please try again.")
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to Gemini API for summary")
        raise RuntimeError("Failed to connect to Gemini API. Please check your internet connection.")
    except Exception as e:
        logger.error(f"Error summarizing transcript: {e}")
        raise RuntimeError(f"Error summarizing transcript: {e}")



