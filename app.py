import os
from flask import Flask, render_template
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, 
            static_folder='static',
            static_url_path='/static')

# Security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response


@app.route("/")
def index():
    """Main application page"""
    return render_template(
        "index.html",
        supabase_url=os.environ.get("SUPABASE_URL", ""),
        supabase_key=os.environ.get("SUPABASE_KEY", ""),
    )


@app.route("/health")
def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "tasks-app"}, 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
