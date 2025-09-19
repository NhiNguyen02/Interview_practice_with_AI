from datetime import datetime, timedelta
import logging
from flask import Blueprint, request, jsonify
from app.database import get_session, InterviewSession, InterviewQuestion, InterviewAnswer
from app.utils import token_required

logger = logging.getLogger(__name__)
history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
@token_required
def get_interview_history(current_user):
    """Get interview history for the current user. Return ALL sessions for this user.
    For each session compute:
      - average score (average of answers)
      - duration in minutes (estimate by answers*2)
      - field
    """
    db = get_session()
    try:
        # Get all sessions for the user (any status) and sort by created_at desc
        sessions = db.query(InterviewSession).filter_by(
            user_id=current_user.id
        ).order_by(InterviewSession.created_at.desc()).all()

        history_items = []
        total_sessions = 0
        total_score = 0
        current_week_sessions = 0
        
        # Calculate current week (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)

        for session in sessions:
            # Get answers for this session
            answers = db.query(InterviewAnswer).filter_by(session_id=session.id).all()

            # Calculate average score from answers
            session_score = sum(a.score or 0 for a in answers) / len(answers) if answers else 0
            total_score += session_score
            total_sessions += 1

            # Check if session is in current week
            if session.created_at and session.created_at >= week_ago:
                current_week_sessions += 1

            # Calculate duration in minutes (estimate based on answers)
            estimated_duration = max(1, len(answers) * 2)  # Fallback: 2 mins/question

            # Format date
            if session.created_at:
                now = datetime.utcnow()
                diff = now - session.created_at
                if diff.days == 0:
                    date_str = f"Hôm nay • {session.created_at.strftime('%H:%M')}"
                elif diff.days == 1:
                    date_str = f"Hôm qua • {session.created_at.strftime('%H:%M')}"
                else:
                    date_str = f"{diff.days} ngày trước • {session.created_at.strftime('%H:%M')}"
            else:
                date_str = "Không xác định"

            history_items.append({
                'id': str(session.id),
                'date': date_str,
                'title': f"Phỏng vấn {session.field}",
                'score': round(session_score, 1),
                'questions': len(answers),
                'duration': estimated_duration,
                'field': session.field,
                'position': '',
                'experience_level': session.experience_level,
                'created_at': session.created_at.isoformat() if session.created_at else None
            })

        # Calculate overall stats
        average_score = total_score / total_sessions if total_sessions > 0 else 0

        stats = {
            'totalSessions': total_sessions,
            'averageScore': round(average_score, 1),
            'currentWeekSessions': current_week_sessions
        }

        logger.info(f"📊 History stats for user {current_user.id}: {stats}")
        logger.info(f"📋 Found {len(history_items)} history items")

        return jsonify({
            'history': history_items,
            'stats': stats,
            'message': 'Lấy lịch sử phỏng vấn thành công'
        })

    except Exception as e:
        logger.error(f"❌ Error getting interview history: {e}")
        return jsonify({'error': 'Không thể lấy lịch sử phỏng vấn'}), 500
    finally:
        db.close()


@history_bp.route('/history/<int:session_id>', methods=['GET'])
@token_required
def get_interview_detail(current_user, session_id):
    """Get detailed information for a specific interview session."""
    db = get_session()
    try:
        # Get session
        session = db.get(InterviewSession, session_id)
        if not session or session.user_id != current_user.id:
            logger.error(f"❌ Invalid session {session_id} for user {current_user.id}")
            return jsonify({'error': 'Phiên phỏng vấn không hợp lệ'}), 404

        # Get questions and answers
        questions = db.query(InterviewQuestion).filter_by(session_id=session_id).all()
        answers = db.query(InterviewAnswer).filter_by(session_id=session_id).all()
        
        # Create QA items
        qa_items = []
        total_score = 0
        
        for i, question in enumerate(questions):
            answer = next((a for a in answers if a.question_id == question.id), None)
            score = (answer.score if answer else 0) or 0
            total_score += score
            
            qa_items.append({
                'id': str(question.id),
                'question': question.content,
                'score': round(float(score), 1)
            })

        # Calculate average score
        average_score = total_score / len(qa_items) if qa_items else 0
        
        # Estimate duration
        estimated_duration = len(qa_items) * 2

        detail = {
            'id': str(session.id),
            'title': f"Phỏng vấn {session.field}",
            'domain': session.field,
            'averageScore': round(average_score, 1),
            'questions': len(qa_items),
            'duration': estimated_duration,
            'qa': qa_items,
            'field': session.field,
            'position': '',
            'experience_level': session.experience_level,
            'created_at': session.created_at.isoformat() if session.created_at else None
        }

        logger.info(f"📋 Interview detail for session {session_id}: {len(qa_items)} Q&A items")

        return jsonify({
            'detail': detail,
            'message': 'Lấy chi tiết phỏng vấn thành công'
        })

    except Exception as e:
        logger.error(f"❌ Error getting interview detail: {e}")
        return jsonify({'error': 'Không thể lấy chi tiết phỏng vấn'}), 500
    finally:
        db.close()


@history_bp.route('/history/<int:session_id>/answers/<int:question_id>', methods=['GET'])
@token_required
def get_answer_detail(current_user, session_id, question_id):
    """Get detailed information for a specific answer."""
    db = get_session()
    try:
        # Validate session
        session = db.get(InterviewSession, session_id)
        if not session or session.user_id != current_user.id:
            logger.error(f"❌ Invalid session {session_id} for user {current_user.id}")
            return jsonify({'error': 'Phiên phỏng vấn không hợp lệ'}), 404

        # Get question
        question = db.get(InterviewQuestion, question_id)
        if not question or question.session_id != session_id:
            logger.error(f"❌ Invalid question {question_id} for session {session_id}")
            return jsonify({'error': 'Câu hỏi không hợp lệ'}), 404

        # Get answer
        answer = db.query(InterviewAnswer).filter_by(
            session_id=session_id, 
            question_id=question_id
        ).first()
        
        if not answer:
            logger.error(f"❌ No answer found for question {question_id} in session {session_id}")
            return jsonify({'error': 'Chưa có câu trả lời cho câu hỏi này'}), 404

        # Format answer detail
        answer_detail = {
            'id': str(answer.id),
            'questionId': str(question_id),
            'question': question.content,
            'answer': answer.transcript_text or '',
            'score': round(float(answer.score or 0), 1),
            'overallScore': {
                'speaking': round(float(answer.speaking_score or 0), 1),
                'content': round(float(answer.content_score or 0), 1),
                'relevance': round(float(answer.relevance_score or 0), 1)
            },
            'feedback': answer.feedback or '',
            'strengths': answer.strengths or [],
            'improvements': answer.improvements or [],
            'interviewId': str(session_id),
            'interviewTitle': f"Phỏng vấn {session.field}",
            'audio_url': answer.user_answer_audio_url
        }

        logger.info(f"📝 Answer detail for question {question_id}: score {answer_detail['score']}")

        return jsonify({
            'answer': answer_detail,
            'message': 'Lấy chi tiết câu trả lời thành công'
        })

    except Exception as e:
        logger.error(f"❌ Error getting answer detail: {e}")
        return jsonify({'error': 'Không thể lấy chi tiết câu trả lời'}), 500
    finally:
        db.close()
