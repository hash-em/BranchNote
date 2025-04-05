from flask import Flask, render_template, request,flash,session,redirect
from flask_session import Session
from db import conn_params,password_hash,login_required,session_collect,db,connection
from markdown import markdown
from helpers import extract_tags
from tree import tree,markdownTree,markdownTree
import os
# FLASK #INTIALISATION
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
# SQL CONNECTION


# Establish a connection&

@app.route("/")
@login_required
def index():
    return redirect("/dashboard")
#LOGIN Handling
@app.get("/login")
def render_login():
    return render_template("login.html")
@app.post("/login")
def login():
    username = request.form.get("username")
    password = password_hash(request.form.get("password"))
    db.execute("SELECT user_id,hash password FROM users WHERE username = ?", (username,))
    user = db.fetchone()
    if (user):
        if password == user["password"] :
            session_collect(user_id = user["user_id"], username = username)
            return redirect("/")
        else:
            flash("Incorrect Password !")
            return redirect("/login")
    else:
        session["username"] = username
        return redirect("/register")

@app.get("/register")
def render_register():
    return render_template("register.html")
@app.post("/register")
def register():
    username = request.form.get("username")
    password = password_hash(request.form.get("password"))
    # check for username in database
    db.execute("SELECT username FROM users WHERE username = ?",(username,))

    already_exists = db.fetchone()
    if (already_exists):
        flash(f"Username '{already_exists["username"]}' already in use")
        return redirect("/register")
    else :
        db.execute("INSERT INTO users (username,hash) VALUES (?,?)", (username,password))
        flash("Welcome !", category="success")
        db.execute("SELECT user_id FROM users WHERE username = ?", (username,))
        session_collect(user_id = db.fetchone()["user_id"], username = username, demo=False)

        try :
            os.mkdir(f"markdown/{session["username"]}")
        except: pass
        connection.commit()
        return redirect("/")

@app.get("/logout")
def logout():
    session.clear()
    return redirect("/")



@app.route("/study", methods=["GET","POST"])
@login_required
def display_study():
    # suggestion = #TODO
    if request.method == "GET":
        flash("choose a note")
        return redirect("/dashboard")
    else:
        query = request.form.get("query")
        extension = query.find(".md")
        if extension!= -1 : query = query[0:extension]
        try :
            filenames = os.listdir(f"markdown/{session['username']}")
            if session.get("demo") == True :
                session["demo"] = False
                filepath =f"markdown/demo/{query}.md"
            else :
                filepath =f"markdown/{session['username']}/{query}.md"
            with open(filepath,"r",encoding="utf-8",errors="replace") as file:
                content = markdownTree(file)
            return render_template("markdown.html", tree=content, filenames=filenames)
        except :
            return redirect("/study")


@app.get("/create")
def create():
    with  open("markdown/create.md","r") as createMd :
        create_tree = markdownTree(createMd)
        return render_template("markdown.html",tree=create_tree)


@app.get("/dashboard")
def dashboard():
    try:
        filelist = os.listdir(f"markdown/{session['username']}")
    except :
        return redirect("/demo")
    return render_template("dashboard.html",files=filelist, username=session["username"])

@app.post("/dashboard")
def addNewfile():
    markdown = request.files["markdown"]
    if markdown:

        markdown.save(os.path.join(f"markdown/{session['username']}/",markdown.filename))
        with open (f"markdown/{session['username']}/{markdown.filename}","r",encoding="utf-8",errors="replace") as file:
            return render_template("markdown.html", tree=markdownTree(file))

@app.get("/demo")
def demo():
    session["demo"] = True
    filelist = os.listdir("markdown/demo")
    return render_template("dashboard.html",files=filelist, username=session["username"])

@app.errorhandler(404)
def not_found(e):
    return render_template("404.html", message = "sorry we couldn't find this page")
