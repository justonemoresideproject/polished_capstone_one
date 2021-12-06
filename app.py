import os

from flask import Flask, render_template, request, flash, redirect, session, g, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
from forms import RegisterForm, LoginForm, UpdateUserForm, TestForm
from models import db, connect_db, User, Destination
from flask_cors import CORS
import requests

CURR_USER_KEY = "curr_user"

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///worldly'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
toolbar = DebugToolbarExtension(app)

connect_db(app)

db.create_all()
db.session.commit()

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None

def do_login(user):
    session[CURR_USER_KEY] = user.id

def do_logout():
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

@app.route('/test', methods=['GET', 'POST'])
def test():
    user = User.query.get(session[CURR_USER_KEY])
    form = TestForm()
    
    if request.method == "POST":
        data = request.get_json()

        destination = Destination(
            user_id = user.id,
            country_name = data['country']
            )

        db.session.add(destination)
        db.session.commit()

        destinations = Destination.query.all()

        flash('You successfully added a country')
        
        return render_template('test.html', user=user, destinations=destinations, form=form)

    destinations = Destination.query.all()

    return render_template('test.html', user=user, destinations=destinations, form=form)

# Landing / Login / Register
@app.route('/')
def home():
    return render_template('/worldly/home.html')

@app.route('/signup', methods=["GET", "POST"])
def signup():
    form = RegisterForm()

    if CURR_USER_KEY in session:
        flash('Already logged in!', 'warning')
        return redirect('/')

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data
            )
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('auth/register.html', form=form)

        do_login(user)

        return redirect("/")

    else:
        return render_template('auth/register.html', form=form)

@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    if CURR_USER_KEY in session:
        flash('Already logged in!', 'warning')
        return redirect('/')

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect("/")

        flash("Invalid credentials.", 'danger')

    return render_template('auth/login.html', form=form)

@app.route('/logout')
def logout():
    do_logout()
    return redirect('/')

# User/Update User
@app.route('/myBoard')
def userBoard():
    if CURR_USER_KEY not in session:
        flash('Please log in', 'danger')
        return redirect('/login')

    user = User.query.get(session[CURR_USER_KEY])
    destinations = Destination.query.filter_by(user_id=user.id)

    return render_template('user/userBoard.html', user=user, destinations=destinations)    

@app.route('/update/<int:user_id>', methods=['GET', 'POST'])
def updateUser(user_id):
    user = User.query.get(user_id)
    form = UpdateUserForm(obj=user)

    if form.validate_on_submit():
        user = user.authenticate(user.username, form.password.data)

        if user:
            user.username = form.username.data
            user.email = form.email.data

            db.session.add(user)
            db.session.commit()
            return redirect('/myBoard')
        else:
            flash('Incorrect Password! Please input your password')
            return render_template('user/updateUser.html', user=user, form=form)

    return render_template('/user/updateUser.html', user=user, form=form)

# Destination Feed / User Destinations / Destination Info
@app.route('/destFeed', methods=['GET', 'POST'])
def destFeedDirect():
    """Directs the user to the destination feed, allows the user to add destinations to their board"""

    user = User.query.get(session[CURR_USER_KEY])

    countries = requests.get('https://restcountries.com/v3.1/all')

    myDestinations = requests.get('http://localhost:5001/myDestinations')

    return render_template('worldly/destinationFeed.html', user=user, countries=countries.json())

@app.route('/myDestinations', methods=['POST', 'GET', 'DELETE'])
def userDestinations():
    # if CURR_USER_KEY not in session:
    #     flash('Please log in', 'danger')
    #     return redirect('/login')

    user = User.query.get(session[CURR_USER_KEY])

    if request.method == "POST":
        data = request.get_json()

        countryName = data["country"]

        user = User.query.get(session[CURR_USER_KEY])

        destination = Destination(
            user_id = user.id,
            country_name = countryName
        )

        db.session.add(destination)
        db.session.commit()

        return (jsonify(destination=destination.serialize()), 201)

    if request.method == "DELETE":
        data = request.get_json()

        countryName = data["country"]

        user = User.query.get(session[CURR_USER_KEY])

        destination = db.session.query(Destination).filter_by(user_id=user.id, country_name=countryName).delete()

        db.session.commit()

        return ('Done', 201)

    myDests = [dest.serialize() for dest in Destination.query.filter_by(user_id=user.id)]

    if len(myDests) == 0:
        return ('', 204)

    return (jsonify(myDests), 201)

@app.route('/dest/<name>')
def findDest(name):
    if CURR_USER_KEY not in session:
        flash('Please log in', 'danger')
        return redirect('/login')

    res = requests.get(f"https://restcountries.com/v3.1/name/'{name}'")

    return render_template('worldly/destinationInfo.html', country = res.json()[0])

@app.route('/trivia')
def getTriviaGame():
    if CURR_USER_KEY not in session:
        flash('Please log in', 'danger')
        return redirect('/login')

    user = User.query.get(session[CURR_USER_KEY])

    try:
        destinations = Destination.query.filter_by(user_id=user.id)

        return render_template('games/trivia.html')
    except: 
        flash('Please select a destination before playing.')
        return redirect('/destFeed')