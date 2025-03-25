from flask import Flask, render_template, request,flash,session,redirect
from flask_session import Session
from db import conn_params,password_hash,login_required,session_collect,db,connection
from markdown import markdown
from helpers import extract_tags
from tree import tree
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
    return render_template("index.html")
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

    test = tree("final")
    test.addDetails("final","somee details","some verbose details about the tree")
    test.addChildren("final","plumbus","omni","foo")
    test.addChildren("omni","man")
    test.addChildren("plumbus",'morty','rick')
    test.addChild("morty","jessica")
    test.addChild("jessica","friend")
    test.addChildren("foo","bar")
    test.addChild("friend","of a friend")
    test.addChildren("man","child","female")
    test.addDetails("of a friend","he is nice","kind of nice")
    test.addChild("of a friend","grand")
    test.addDetails("man","<p>he is the son of god</p>","<h1>he is a creation</h1><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, modi repudiandae. Nulla tempore suscipit fuga, a, nam voluptates mollitia, est excepturi possimus animi accusamus impedit minima rerum incidunt voluptatum eos.Saepe, assumenda excepturi. Distinctio in optio facere itaque, nobis dicta aliquam animi. Cumque libero hic sapiente quod? Beatae cumque veniam magni ipsam consequuntur sit eius libero voluptate! Recusandae, repellendus facere?Harum quod excepturi quae modi, rem commodi debitis voluptate. Voluptatem blanditiis ducimus, ipsum est vero ea dolor ad voluptas molestias corporis doloribus minima sit consectetur, ut fugit veniam iure facere!you know..</p><h2>FROM GOD</h2>")
    test.decsribe()
    tags = {}
    depth = test.maxDepth()
    db.execute("SELECT * FROM travail WHERE user_id = ? AND done = 'n'",(session["user_id"],))
    todo = db.fetchmany()
    # TODO remove this
    todo = ["this",'that',"those"]
    if request.method == "GET":
        return render_template("study.html",todo = todo, depth = depth,tree = test)
    else:
        query = request.form.get("query")
        try :
            with open(f"exercices/{query}.md","r") as file:
                exercice = file.read()
                tags,exercice = extract_tags(exercice)
                exercice = markdown(exercice)

            return render_template("study.html", todo=todo, exercice = exercice, tags = tags , name = query, tree=test)
        except :
            flash("couldn't find")
            return redirect("/study")


@app.get("/create")
def create():
# try to include a way to save progress in session somehow
    return render_template("create.html")




@app.errorhandler(404)
def not_found(e):
    return render_template("404.html", message = "sorry we couldn't find this page")
