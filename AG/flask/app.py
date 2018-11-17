from flask import Flask, jsonify, render_template, redirect, url_for, request, Response, stream_with_context
from pprint import pprint
import json
from bson import json_util 
from flask_pymongo import PyMongo



app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/project_reax")


@app.route('/')
def home():

    return render_template('home.html')

@app.route('/statelatlong')
def state_lat_long():

    # statelatlongs = mongo.db.reddit_state_ll.find()
    documents = [doc for doc in mongo.db.reddit_state_ll.find()]

    
    return json_util.dumps({'cursor': documents})

@app.route('/citylatlong')
def city_lat_long():

   
    documents = [doc for doc in mongo.db.reddit_city_ll.find({})]

    
    return json_util.dumps({'cursor': documents})


if __name__ == '__main__':
    app.run(debug=True)