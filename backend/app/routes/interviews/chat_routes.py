import os
import logging
import requests
from flask import Blueprint, request, jsonify
from app.utils import token_required

logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)


@chat_bp.route('/chat', methods=['POST'])
@token_required
def chat_with_bot(current_user):
    """Handle chat messages by forwarding to Gemini with interview-only prompt."""
    data = request.get_json() or {}
    question = data.get('question')
    if not question:
        return jsonify({'error': 'Missing question'}), 400
    previous_answer = data.get('previousAnswer')

    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        logger.error('GEMINI_API_KEY not configured')
        return jsonify({'error': 'GEMINI_API_KEY not configured'}), 500

    # Prompt nâng cao: hiểu ngữ cảnh, tận dụng previous_answer nếu user tham chiếu
    prompt = (
        "Bạn là một trợ lý phỏng vấn thông minh, chỉ hỗ trợ các chủ đề liên quan đến "
        "phỏng vấn, tuyển dụng, CV và kỹ năng xin việc. Nếu câu hỏi nằm ngoài các chủ đề trên, "
        "hãy lịch sự từ chối và gợi ý các chủ đề phù hợp (ví dụ: chuẩn bị CV, kỹ năng trả lời, câu hỏi phổ biến theo lĩnh vực).\n\n"
        "Hướng dẫn xử lý ngữ cảnh:\n"
        "- Nếu người dùng tham chiếu tới một câu hỏi trong lịch sử (ví dụ: 'câu đầu tiên', 'câu 1', 'câu thứ hai', 'câu trước đó', 'câu hỏi về X'), "
        "hãy tìm câu tương ứng trong previous_answer (nếu có) và đưa ra hướng dẫn trả lời cụ thể cho đúng câu đó.\n"
        "- Nếu không tìm thấy câu phù hợp trong previous_answer, hoặc câu hiện tại không liên quan, hãy trả lời bình thường theo chủ đề phỏng vấn.\n"
        "- Trả lời bằng tiếng Việt, ngắn gọn, hữu ích, có thể kèm ví dụ/điểm chính.\n"
    )

    if previous_answer:
        prompt += (
            "\nDữ liệu ngữ cảnh (previous_answer - có thể là danh sách câu hỏi/đáp án trước đây, nhớ phân tích từ khóa/Thứ tự):\n"
            f"{previous_answer}\n"
        )

    prompt += (
        "\nCâu hỏi hiện tại của người dùng: "
        f"{question}\n"
        "Hãy trả lời bám sát yêu cầu trên."
    )

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    endpoint = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.5-flash-lite:generateContent"
    )

    try:
        resp = requests.post(endpoint, params={"key": api_key}, json=payload, timeout=30)
        if not resp.ok:
            logger.error(f"Gemini API error: {resp.status_code} - {resp.text}")
            return jsonify({'error': 'Gemini API error'}), resp.status_code

        data = resp.json()
        answer = data["candidates"][0]["content"]["parts"][0]["text"]
        return jsonify({'answer': answer.strip()})
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error calling Gemini: {e}")
        return jsonify({'error': 'Không thể kết nối với dịch vụ AI'}), 503
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({'error': 'Lỗi không xác định'}), 500
