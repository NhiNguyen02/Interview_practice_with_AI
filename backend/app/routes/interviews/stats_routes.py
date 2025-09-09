import logging
from flask import Blueprint, request, jsonify
from app.database import get_session, InterviewSession, InterviewAnswer
from datetime import datetime
from app.utils import token_required

logger = logging.getLogger(__name__)
stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    """Get comprehensive statistics for the current user's interview practice from DB."""
    db = get_session()
    try:
        # Get all sessions from DB
        all_sessions = db.query(InterviewSession).filter(
            InterviewSession.user_id == current_user.id
        ).all()
        
        # Align with DB enum values and be backward-compatible with legacy values
        completed_statuses = {'da_hoan_thanh', 'hoan_thanh'}
        ongoing_statuses = {'dang_dien_ra', 'in_progress'}
        cancelled_statuses = {'da_huy', 'cancelled'}

        completed_sessions = [s for s in all_sessions if (s.status or '').lower() in completed_statuses]
        ongoing_sessions = [s for s in all_sessions if (s.status or '').lower() in ongoing_statuses]

        # Calculate statistics
        total_sessions = len(all_sessions)
        total_completed = len(completed_sessions)
        total_ongoing = len(ongoing_sessions)
        
        # Score statistics - calculate from answers FOR ANY SESSION THAT HAS ANSWERS
        # Some clients may not call finish endpoint; include sessions with answers regardless of status
        total_score_10 = 0.0
        scored_sessions = []
        session_scores_cache = {}
        for session in all_sessions:
            answers = db.query(InterviewAnswer).filter_by(session_id=session.id).all()
            if not answers:
                continue
            # Note: scores already on 0..10 scale in DB; do not rescale
            base_avg = sum((a.score or 0) for a in answers) / len(answers)
            session_score_10 = round(float(base_avg), 2)
            session_scores_cache[session.id] = session_score_10
            total_score_10 += session_score_10
            scored_sessions.append(session)

        average_score = round(total_score_10 / len(scored_sessions), 2) if scored_sessions else 0
        
        # Field distribution
        field_stats = {}
        for session in scored_sessions:
            field = session.field or 'Khác'
            if field not in field_stats:
                field_stats[field] = {'count': 0, 'total_score': 0.0}
            field_stats[field]['count'] += 1
            # Use cached 10-point session score
            session_score_10 = session_scores_cache.get(session.id)
            if session_score_10 is None:
                answers = db.query(InterviewAnswer).filter_by(session_id=session.id).all()
                base_avg = sum((a.score or 0) for a in answers) / len(answers) if answers else 0
                session_score_10 = round(float(base_avg), 2)
                session_scores_cache[session.id] = session_score_10
            field_stats[field]['total_score'] += session_score_10

        # Calculate field averages
        for field in field_stats:
            field_stats[field]['average_score'] = round(
                field_stats[field]['total_score'] / field_stats[field]['count'], 2
            )

        # Recent performance (last 5 completed sessions by created_at desc)
        recent_scores = []
        completed_sorted = sorted(
            scored_sessions,
            key=lambda s: (s.created_at or 0),
            reverse=True,
        )
        recent_chart = []
        for session in completed_sorted[:5]:
            session_score_10 = session_scores_cache.get(session.id)
            if session_score_10 is None:
                answers = db.query(InterviewAnswer).filter_by(session_id=session.id).all()
                base_avg = sum((a.score or 0) for a in answers) / len(answers) if answers else 0
                session_score_10 = round(float(base_avg), 2)
            recent_scores.append(session_score_10)
            # Pre-format label for chart (dd/MM)
            label = session.created_at.strftime('%d/%m') if isinstance(session.created_at, datetime) and session.created_at else '—'
            recent_chart.append({'label': label, 'value': session_score_10})

        stats = {
            'total_sessions': total_sessions,
            'completed_sessions': total_completed,
            'ongoing_sessions': total_ongoing,
            'completion_rate': round((total_completed / total_sessions * 100) if total_sessions > 0 else 0, 1),
            'total_score': round(total_score_10, 2),
            'average_score': average_score,
            'field_distribution': field_stats,
            'recent_performance': recent_scores,
            'recent_chart': recent_chart,
            'performance_trend': 'improving' if len(recent_scores) >= 2 and recent_scores[-1] > recent_scores[0] else 'stable'
        }

        return jsonify({
            'stats': stats,
            'message': 'Lấy thống kê thành công'
        })
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return jsonify({'error': 'Không thể lấy thống kê. Vui lòng thử lại.'}), 500
    finally:
        db.close()
