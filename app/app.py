from flask import *
# from flask_scss import Scss
# from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/rosa', endpoint='rosa_sheet')
def sheet_rosa():
    return render_template('sheet_rosa.html')

@app.route('/pyuku', endpoint='pyuku_sheet')
def sheet_pyuku():
    return render_template('sheet_pyuku.html')

if __name__ == '__main__':
    app.run(debug=True)
