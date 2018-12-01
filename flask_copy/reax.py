from flask import Flask, jsonify, render_template, redirect, url_for, request, Response, stream_with_context
from pprint import pprint
import json
from bson import json_util 
import numpy as np
from flask_pymongo import PyMongo

from pprint import pprint



app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/project_reax")


@app.route('/')
def home():
  
    return render_template('home.html')

@app.route('/statered_sent')
def sshoyo():

    documents = [doc for doc in mongo.db.statered_sent.find({})]

    return json_util.dumps({'cursor': documents})

@app.route('/cityred_sent')
def cshoyo():

    documents = [doc for doc in mongo.db.cityred_sent.find({})]

    return json_util.dumps({'cursor': documents})

if __name__ == '__main__':
    app.run(debug=True)