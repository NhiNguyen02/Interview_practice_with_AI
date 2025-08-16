from datetime import datetime, timedelta, timezone
import jwt
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash

from app.database import get_session, User
from app.utils import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    full_name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not full_name or not email or not password:
        return jsonify({'error': 'Missing name, email, or password'}), 400

    session = get_session()
    try:
        if session.query(User).filter_by(email=email).first():
            return jsonify({'error': 'User already exists'}), 400
        user = User(full_name=full_name, email=email, password_hash=generate_password_hash(password))
        session.add(user)
        session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    finally:
        session.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    session = get_session()
    try:
        user = session.query(User).filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            token = jwt.encode(
                {'id': user.id, 'exp': datetime.now(timezone.utc) + timedelta(hours=1)},
                current_app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            return jsonify({'token': token}), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    finally:
        session.close()

@auth_bp.route('/protected', methods=['GET'])
@token_required
def protected(current_user):
    return jsonify({'id': current_user.id, 'name': current_user.full_name, 'email': current_user.email})


@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json(force=True)
    session = get_session()
    try:
        if 'bio' in data:
            current_user.bio = data['bio']
        if 'major' in data:
            current_user.major = data['major']
        if 'skills' in data:
            current_user.skills = data['skills']
        if 'avatar_url' in data:
            current_user.avatar_url = data['avatar_url']
        session.merge(current_user)
        session.commit()
        return jsonify({'message': 'Profile updated'}), 200
    finally:
        session.close()