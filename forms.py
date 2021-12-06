from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, Email, Length

class RegisterForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[DataRequired()])

    email = StringField('E-mail', validators=[DataRequired(), Email()])

    password = PasswordField('Password', validators=[Length(min=6)])

class LoginForm(FlaskForm):
    """Login Form"""

    username = StringField('Username', validators=[DataRequired()])

    password = PasswordField('Password', validators=[Length(min=6)])

class UpdateUserForm(FlaskForm):
    """Update User Form"""

    username = StringField('Username', validators=[DataRequired()])

    email = StringField('Email', validators=[DataRequired()])

    password = PasswordField('Password', validators=[DataRequired()])

class TestForm(FlaskForm):
    """Test Form"""
    country = StringField('Country', validators=[DataRequired()])