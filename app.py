from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import os
import re

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'jharkhand'

mysql = MySQL(app)
app.secret_key = 'root'


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/auth', methods=['GET', 'POST'])
def auth():
    msg = ''
    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'login':
            username = request.form['login_username']
            password = request.form['login_password']

            cur = mysql.connection.cursor()
            cur.execute("SELECT * FROM accounts WHERE username = %s AND password = %s", (username, password))
            acc = cur.fetchone()

            if acc:
                session['loggedin'] = True
                session['id'] = acc[0]
                session['username'] = acc[1]
                return redirect(url_for('home'))
            else:
                msg = 'Invalid Login Credentials'

        elif action == 'register':
            username = request.form['register_username']
            email = request.form['register_email']
            password = request.form['register_password']

            cur = mysql.connection.cursor()
            cur.execute("SELECT * FROM accounts WHERE username = %s", (username,))
            acc = cur.fetchone()

            if acc:
                msg = 'Account already exists!'
            elif re.match(r'[^@]+@[^@]+\.[^@]+', email) is None:
                msg = 'Invalid email address!'
            elif not re.match(r'[A-Za-z0-9]+', username):
                msg = 'Username must contain only characters and numbers!'
            elif not username or not password or not email:
                msg = 'Please fill out the form!'
            else:
                cur.execute(
                    "INSERT INTO accounts (username, password, email) VALUES (%s, %s, %s)",
                    (username, password, email)
                )
                cur.connection.commit()
                msg = 'You have successfully registered! You can now login.'

    return render_template('auth.html', msg=msg, page='auth')


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
    return render_template('betla.html')


if __name__ == '__main__':
    app.run(debug=True, port=8000)
