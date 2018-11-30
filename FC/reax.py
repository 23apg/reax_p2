from flask import Flask, jsonify, render_template, redirect, url_for, request, Response, stream_with_context
from pprint import pprint
import json
from bson import json_util 
import numpy as np
import pymongo

from pprint import pprint

#connection with Mongo
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.project_reax
db_cities_full = db.cities_full

app = Flask(__name__)

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

@app.route("/getkeys/<i>")
def getkeys(i):
    trend_woeid=23424977
    i = int(i)
    keys_data = db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["keys"]

    return jsonify(keys_data[0:200])

@app.route("/gettrends/<t>")
def gettrends(t):
    trends = []
    trend_woeid=23424977
    t = int(t)

    for i in range(0,t):
        trends.append(str(i+1) + " - " + db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["name"])

    return jsonify(trends)

@app.route("/getvaderstats/<i>")
def getvader(i):
    trend_woeid=23424977

    i = int(i)
    vader_data = db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["vader_statistics"]

    return jsonify(vader_data)  

@app.route("/getvaderstatsst/<i>/<state>")
def getvader2(i,state):
    trend_woeid=23424977

    i = int(i)
    vader_data = db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["vader_statistics"]
    for element in vader_data:
        if element["state"] == state:
            vader_score = element["avg_vader"]
    return jsonify(vader_score)  

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