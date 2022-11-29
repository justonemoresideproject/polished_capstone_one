#Polished Capstone

from datetime import datetime
import sqlalchemy as db
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

def connect_db(app):
    engine = db.create_engine("postgresql://postgres@localhost/worldly")
    conn = engine.connect()
    conn.execute("commit")
    conn.close()
    db.app = app
    db.init_app(app)

class User(db.Model):
    """User in the system."""

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    # board = db.relationship('Board', backref='user')

    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"

    @classmethod
    def signup(cls, username, email, password):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            email=email,
            password=hashed_pwd
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`."""

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False

class Destination(db.Model):
    """Model for destinations"""

    __tablename__ = 'destinations'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    country_name = db.Column(db.Text, nullable=False)

    def serialize(self):
        return {
            'user_id': self.user_id,
            'country_name': self.country_name
        }

class Scores(db.Model):
    """Model for scores"""

    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    score = db.Column(db.Integer)

    # user = db.relationship('User', backref='scores')

    def serialize(self):
        return {
            'user_id': self.user_id,
            'score': self.score
        }