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
def redhome():
  
    return render_template('reddithome.html')

@app.route('/twitter')
def twithome():
  
    return render_template('twitterhome.html')


@app.route('/simpler')
def simpler():

    documents = [doc for doc in mongo.db.rs.find({})]

    return json_util.dumps({'cursor': documents})

# @app.route('/cities_reddit')
# def getloc(url):
#     documents = [doc for doc in mongo.db.twitter_trends_full.find()]

#     return json_util.dumps({'cursor': documents})



#     return location

@app.route('/cityclusters')
def cityclusters():
    documents = [doc for doc in mongo.db.twitter_trends_full.find()]

    return json_util.dumps({'cursor': documents})

   
if __name__ == '__main__':
    app.run(debug=True)