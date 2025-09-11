from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import os
import re


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Pass4@ryan'
app.config['MYSQL_DB'] = 'jharkhand'

mysql = MySQL(app)
app.secret_key = 'root'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    msg=''
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM accounts WHERE username = %s AND password = %s", (username, password))
        acc = cur.fetchone()
        if acc:
            session['loggedin'] = True
            session['id'] = acc
            session['username'] = acc[1]
            return redirect(url_for('home'))
        else:
            msg = 'Invalid Credentials'
    return render_template('login.html',msg=msg)


@app.route('/register', methods=['GET', 'POST'])
def register():
    msg = 'CREATE NEW ACCOUNT'
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM accounts WHERE username = %s", (username,))
        acc = cur.fetchone()
        if acc:
            msg = 'Account already exists!'
            return render_template('register.html', msg=msg)
        elif re.match(r'[^@]+@[^@]+\.[^@]+', email) is None:
            msg = 'Invalid email address!'
            return render_template('register.html', msg=msg)
        elif not re.match(r'[A-Za-z0-9]+', username):
            msg = 'Username must contain only characters and numbers!'
            return render_template('register.html', msg=msg)
        elif not username or not password or not email:
            msg = 'Please fill out the form!'
            return render_template('register.html', msg=msg)
        else:
            cur.execute("INSERT INTO accounts (username, password, email) VALUES (%s, %s, %s)", (username, password, email))
            cur.connection.commit()
            msg = 'You have successfully registered!'
            return render_template('login.html', msg=msg)
    return render_template('register.html', msg=msg)


@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for('home'))


@app.route('/planner')
def planner():
    return render_template('planner.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/destinations')
def destinations():
    return render_template('destinations.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')



if __name__ == '__main__':
    app.run(debug=True, port=8000)