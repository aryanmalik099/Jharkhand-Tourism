from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
import os
import re
from flask import request   

app = Flask(__name__)

# --- Database Configuration ---
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'jharkhand'
# Use DictCursor to access columns by name - THIS IS IMPORTANT
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# --- Initialize MySQL ---
mysql = MySQL(app)

# --- Secret Key for Session Management ---
app.secret_key = 'your_very_secret_key' # It's better to use a random key

# === Core Routes ===

@app.route('/')
def home():
    """Renders the homepage."""
    return render_template('index.html')

@app.route('/destinations')
def destinations():
    """Renders the destinations page."""
    return render_template('betla.html')

@app.route('/gallery')
def gallery():
    """Renders the gallery page."""
    return render_template('gallery.html')

# === Authentication Routes ===

@app.route('/auth', methods=['GET', 'POST'])
def auth():
    """Handles user login and registration."""
    msg = ''
    if 'loggedin' in session:
        return redirect(url_for('profile'))

    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'login':
            username = request.form.get('login_username')
            password = request.form.get('login_password')
            cur = mysql.connection.cursor()
            cur.execute("SELECT * FROM accounts WHERE username = %s AND password = %s", (username, password))
            account = cur.fetchone()
            if account:
                session['loggedin'] = True
                session['id'] = account['id']
                session['username'] = account['username']
                return redirect(url_for('home'))
            else:
                msg = 'Incorrect username or password!'

        elif action == 'register':
            username = request.form.get('register_username')
            password = request.form.get('register_password')
            email = request.form.get('register_email')
            cur = mysql.connection.cursor()
            cur.execute("SELECT * FROM accounts WHERE username = %s", (username,))
            account = cur.fetchone()
            if account:
                msg = 'Account already exists!'
            elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
                msg = 'Invalid email address!'
            elif not re.match(r'[A-Za-z0-9]+', username):
                msg = 'Username must contain only characters and numbers!'
            elif not username or not password or not email:
                msg = 'Please fill out the form!'
            else:
                cur.execute("INSERT INTO accounts (username, password, email) VALUES (%s, %s, %s)", (username, password, email))
                mysql.connection.commit()
                msg = 'You have successfully registered! Please login.'

    return render_template('auth.html', msg=msg, page='auth')

@app.route('/logout')
def logout():
    """Logs the user out and clears the session."""
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for('auth'))

# === New Feature Routes ===

@app.route('/api/smart-plan', methods=['POST'])
def get_smart_plan():
    """Generates a smart itinerary based on user preferences."""
    try:
        prefs = request.json
        duration = int(prefs.get('duration', 3))
        interests = prefs.get('interests', []) # e.g., ['wildlife', 'waterfall']
        
        # In a real-world scenario, you'd have complex logic here.
        # This is a simplified example:
        # 1. Fetch places that match the interests.
        # 2. Prioritize and select a logical number of places for the duration.
        # 3. Group them by day (e.g., 2-3 places per day).

        query = "SELECT id, name, district, category, description, image_url, latitude, longitude FROM places"
        if interests:
            # Creates a query like: SELECT ... WHERE category IN ('wildlife', 'waterfall')
            placeholders = ','.join(['%s'] * len(interests))
            query += f" WHERE category IN ({placeholders})"
        
        query += " LIMIT %s"
        
        # Limit places to a reasonable number, e.g., 2 per day
        limit = duration * 2
        params = interests + [limit]

        cur = mysql.connection.cursor()
        cur.execute(query, tuple(params))
        places = cur.fetchall()

        # Simple day-wise distribution
        itinerary = []
        for i, place in enumerate(places):
            day_num = (i // 2) + 1 # Assign 2 places per day
            itinerary.append({ "day": day_num, "place": place })
            
        return jsonify({"success": True, "itinerary": itinerary})

    except Exception as e:
        print(e) # For debugging
        return jsonify({"success": False, "message": "Could not generate a plan."}), 500

@app.route('/profile')
def profile():
    """Displays the user's profile with their trips and saved places."""
    if 'loggedin' in session:
        user_id = session['id']
        cur = mysql.connection.cursor()

        # Fetch Planned Trips (not completed)
        cur.execute("SELECT * FROM trips WHERE user_id = %s AND completed = FALSE", (user_id,))
        planned_trips = cur.fetchall()

        # Fetch Trip History (completed)
        cur.execute("SELECT * FROM trips WHERE user_id = %s AND completed = TRUE", (user_id,))
        trip_history = cur.fetchall()

        # Fetch Saved Places
        cur.execute("""
            SELECT p.id, p.name, p.description, p.image_url
            FROM saved_places sp
            JOIN places p ON sp.place_id = p.id
            WHERE sp.user_id = %s
        """, (user_id,))
        saved_places = cur.fetchall()

        return render_template('profile.html',
                               username=session['username'],
                               planned_trips=planned_trips,
                               trip_history=trip_history,
                               saved_places=saved_places,
                               page='profile')
    return redirect(url_for('auth'))

@app.route('/planner')
def planner():
    """Renders the trip planner page."""
    return render_template('trip_planner.html')

@app.route('/plan1')
def plan1():
    return render_template('plan1.html')

@app.route('/marketplace')
def marketplace():
    """Renders the local vendors and marketplace page."""
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, name, category, image_url FROM vendors")
    vendors = cur.fetchall()
    return render_template('marketplace.html', vendors=vendors)

@app.route('/vendor/<int:vendor_id>')
def vendor_profile(vendor_id):
    """Displays the detailed profile of a specific vendor."""
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM vendors WHERE id = %s", (vendor_id,))
    vendor = cur.fetchone()
    if vendor:
        return render_template('vendor_profile.html', vendor=vendor)
    return "Vendor not found", 404

# === API Routes for Dynamic Content ===

@app.route('/api/places')
def get_places():
    """API endpoint to get places for the trip planner."""
    cur = mysql.connection.cursor()
    # Ensure latitude and longitude are selected
    cur.execute("SELECT id, name, district, category, description, image_url, latitude, longitude FROM places")
    places = cur.fetchall()
    return jsonify(places)

@app.route('/api/trips', methods=['POST'])
def save_trip():
    """API endpoint to save a new trip."""
    if 'loggedin' in session:
        data = request.get_json()
        trip_name = data.get('name', 'My New Trip') # Provide a default name
        place_ids = data.get('places')
        user_id = session['id']

        if not place_ids:
            return jsonify({'success': False, 'message': 'No places selected.'}), 400

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO trips (user_id, trip_name) VALUES (%s, %s)", (user_id, trip_name))
        trip_id = cur.lastrowid

        # Insert into trip_places junction table
        for place_id in place_ids:
            cur.execute("INSERT INTO trip_places (trip_id, place_id) VALUES (%s, %s)", (trip_id, place_id))

        mysql.connection.commit()
        return jsonify({'success': True, 'message': 'Trip saved successfully!'})

    return jsonify({'success': False, 'message': 'User not logged in.'}), 401


if __name__ == '__main__':
    app.run(debug=True, port=8000)