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
app.config['UPLOAD_FOLDER'] = "markdown/"
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
        flash("Please register to use that username !")
        session["username"] = username
        return redirect("/register")

@app.get("/register")
def render_register():
    return render_template("register.html")
@app.post("/register")
def register():
    section = request.form.get("section")
    if section not in ["info","tech","math","sci"] : return redirect(404)
    username = request.form.get("username")
    password = password_hash(request.form.get("password"))
    niveau = request.form.get("niveau")
    # check for username in database
    db.execute("SELECT username FROM users WHERE username = ?",(username,))

    already_exists = db.fetchone()
    if (already_exists):
        flash(f"Username '{already_exists["username"]}' already in use")
        return redirect("/register")
    else :
        db.execute("INSERT INTO users (username,subscription,hash,section,niveau) VALUES (?,'n',?,?,?)", (username,password,section,niveau))
        flash("Welcome !", category="success")
        db.execute("SELECT user_id FROM users WHERE username = ?", (username,))
        session_collect(user_id = db.fetchone()["user_id"], username = username)
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
            filenames = os.listdir("markdown")
            with open(f"markdown/{query}.md","r") as file:
                content = markdownTree(file)
            return render_template("markdown.html", tree=content, filenames=filenames)
        except :
            flash("couldn't find")
            return redirect("/study")


@app.get("/create")
def create():
    with  open("markdown/create.md","r") as createMd :
        create_tree = markdownTree(createMd)
        return render_template("markdown.html",tree=create_tree)


@app.get("/dashboard")
def dashboard():
    filelist = os.listdir("markdown")
    return render_template("dashboard.html",files=filelist, username=session["username"])

@app.post("/dashboard")
def addNewfile():
    markdown = request.files["markdown"]
    if markdown:
        markdown.save(os.path.join(app.config['UPLOAD_FOLDER'], markdown.filename))
        with open (f"markdown/{markdown.filename}","r") as file:
            return render_template("markdown.html", tree=markdownTree(file))


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html", message = "sorry we couldn't find this page")
