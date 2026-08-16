from flask import *
from flask_scss import Scss
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/rosa', endpoint='rosa_sheet')
def sheet():
    return render_template('sheet_rosa.html')

if __name__ == '__main__':
    app.run(debug=True)
