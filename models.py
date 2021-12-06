from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

def connect_db(app):
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

# class Board(db.Model):
#     """Model for boards"""

#     __tablename__ = 'boards'

#     id = db.Column(
#         db.Integer,
#         primary_key=True,
#     )

#     name = db.Column(db.Text, nullable=False)

#     destinations = db.relationship('destinations', backref='boards')

#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

# class BoardDestinations(db.Model):
#     """Model for the destinations added to boards. Destinations can be a country, capital, region, or subregion"""

#     __tablename__ = 'boardDests'

#     id = db.Column(db.Integer, primary_key=True)

#     dest_id = relationship('destinations', backref='board_dests')

#     board = relationship('Board')

# class Country(db.Model):
#     """Model for countries based off of the rest countries api"""

#     __tablename__ = 'countries'

#     id = db.Column(db.Integer, primary_key=True)

#     name = db.Column(db.Text, nullable=False, unique=True)

#     capital = db.Column(db.Text, nullable=False)

#     region = db.Column(db.Text, nullable=False)

#     subregion=db.Column(db.Text, nullable=True)

#     population=db.Column(db.Integer, nullable=False)

#     flag_url = db.Column(db.Text, nullable=True)

# class Region(db.Model):
#     """Model for regions based off of the rest countries api"""

#     __tablename__ = 'regions'

#     id = db.Column(db.Integer, primary_key=True)

#     name = db.Column(db.Text, nullable=False)

# class Subregion(db.Model):
#     """Model for the subregions based off of the rest countries api"""

#     __tablename__ = 'subregions'

#     id = db.Column(db.Integer, primary_key=True)

#     name = db.Column(db.Text, nullable=False)

#     region = db.Column(db.Integer, db.ForeignKey('regions.id'))

# class Capital(db.Model):
#     """Model for capitals"""

#     __tablename__ = 'capitals'

#     id = db.Column(db.Integer, primary_key=True)

#     name = db.Column(db.Text, nullable=False)

#     country = db.Column(db.Integer, db.ForeignKey('countries.id'))
    
# class BoardCountries(db.Model):
#     """Many to many relationship board for the countries added to a user's board"""

#     __tablename__ = 'boardCountries'

#     id = db.Column(db.Integer, primary_key=True)

#     country_id = db.Column(db.Integer, db.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False)

#     board_id = db.Column(db.Integer, db.ForeignKey('boards.id', ondelete='CASCADE'), nullable=False)

# class BoardRegions(db.Model):
#     """Many to many relationship board for the regions added to a user's board"""

#     __tablename__ = 'boardRegions'

#     id = db.Column(db.Integer, primary_key=True)

#     regions_id = db.Column(db.Integer, db.ForeignKey('regions.id', ondelete='CASCADE'), nullable=False)

#     board_id = db.Column(db.Integer, db.ForeignKey('boards.id', ondelete='CASCADE'), nullable=False)

# class BoardSubregions(db.Model):
#     """Many to many relationship board for the subregions added to a user's board"""

#     __tablename__ = 'boardSubregions'

#     id = db.Column(db.Integer, primary_key=True)

#     subregions_id = db.Column(db.Integer, db.ForeignKey('subregions.id', ondelete='CASCADE'), nullable=False)

#     board_id = db.Column(db.Integer, db.ForeignKey('boards.id', ondelete='CASCADE'), nullable=False)

# class BoardCapitals(db.Model):
#     """Many to many relationship board for the capitals added to a user's board"""

#     __tablename__ = 'boardCapitals'

#     id = db.Column(db.Integer, primary_key=True)

#     capital_id = db.Column(db.Integer, db.ForeignKey('capitals.id', ondelete='CASCADE'), nullable=False)

#     board_id = db.Column(db.Integer, db.ForeignKey('boards.id', ondelete='CASCADE'), nullable=False)