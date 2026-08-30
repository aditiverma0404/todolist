import os
from flask import Flask, render_template, request, redirect, url_for
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route("/")
def index():
    response = supabase.table("todos").select("*").order("created_at", desc=True).execute()
    todos = response.data or []
    return render_template("index.html", todos=todos)


@app.route("/add", methods=["POST"])
def add_todo():
    task = request.form.get("task", "").strip()
    if task:
        supabase.table("todos").insert({"task": task, "is_complete": False}).execute()
    return redirect(url_for("index"))


@app.route("/toggle/<int:todo_id>", methods=["POST"])
def toggle_todo(todo_id):
    # Fetch current state
    response = supabase.table("todos").select("is_complete").eq("id", todo_id).single().execute()
    if response.data:
        current = response.data["is_complete"]
        supabase.table("todos").update({"is_complete": not current}).eq("id", todo_id).execute()
    return redirect(url_for("index"))


@app.route("/delete/<int:todo_id>", methods=["POST"])
def delete_todo(todo_id):
    supabase.table("todos").delete().eq("id", todo_id).execute()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)
