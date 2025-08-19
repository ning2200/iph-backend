import os
from dotenv import load_dotenv
from flask import Flask
from routes.sheets_routes import sheets_routes

load_dotenv()

app = Flask(__name__)
app.register_blueprint(sheets_routes)

if __name__ == '__main__':
    app.run(host=os.getenv('HOST'), port=os.getenv('FLASK_PORT'))