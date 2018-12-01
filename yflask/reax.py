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


# @app.route('/simpler')
# def simpler():

#     documents = [doc for doc in mongo.db.rs.find({})]

#     return json_util.dumps({'cursor': documents})

@app.route('/cities_full_lite')
def getloc():
    documents = [doc for doc in mongo.db.city_full_lite.find({})]

    return json_util.dumps({'cursor': documents})


@app.route('/cityreddit')
def cityclusters():
    documents = [doc for doc in mongo.db.city_simple2.find({})] 

    return json_util.dumps({'cursor': documents})

@app.route('/getredditkeys/<s>')
def getredditkeys(s):
    
    docs = mongo.db.state_simple2.find({'location': s})
    dword = []
    for d in docs:
        cou = d['wordcloud']
        for c in cou:
            dword.append(dict(key = c[0], value = c[1]))
  
    return jsonify(dword)

@app.route("/getkeys/<i>")
def getkeys(i):
    trend_woeid=23424977
    i = int(i)
    keys_data = mongo.db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["keys"]

    return jsonify(keys_data[0:200])

@app.route("/gettrends/<t>")
def gettrends(t):
    trends = []
    trend_woeid=23424977
    t = int(t)

    for i in range(0,t):
        trends.append(str(i+1) + " - " + mongo.db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["name"])

    return jsonify(trends)
   
if __name__ == '__main__':
    app.run(debug=True)