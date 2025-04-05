from flask import Flask, render_template, request,flash,session,redirect
from flask_session import Session
from functools import wraps
import mariadb

# connection parameters
conn_params= {
    "user" : "root",
    "password" : "test123",
    "host" : "localhost",
    "database" : "startoday"
}

connection= mariadb.connect(**conn_params)

db= connection.cursor(dictionary="true")

def  session_collect(**data):
    """takes any amount data as arguments and dynamically adds them to the user's session dict. \n
        Usage session_collect(key1 = val1 , key2 = val2 ...)\n
        For instance if you have a variable username = 'David' to add it you can do the following
        session_collect(username = username) where the first username is they key and the second one is 'david'"""
    for key,value in data.items():
        session[key] = value
def password_hash(password):
    return password

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (session.get("user_id") is None):
            return redirect("/login")
        db.execute("SELECT user_id FROM users WHERE user_id = ?", (session.get("user_id"),))
        if (db.fetchone() is None): return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function
