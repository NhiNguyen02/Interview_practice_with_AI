from functools import wraps
from flask import request, jsonify, current_app
import jwt
from app.database import get_session, User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization', '')
        parts = auth_header.split()
        if len(parts) == 2 and parts[0].lower() == 'bearer':
            token = parts[1]
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            session = get_session()
            current_user = session.get(User, data['id'])
        except Exception:
            return jsonify({'error': 'Token is invalid'}), 401
        else:
            result = f(current_user, *args, **kwargs)
        finally:
            if 'session' in locals():
                session.close()
        return result
    return decorated