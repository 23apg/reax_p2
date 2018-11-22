
# Dependencies
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from pprint import pprint
import pymongo
import tweepy
import json
import numpy as np


#connection with Mongo
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.project_reax
db_cities_full = db.cities_full


app = Flask(__name__)


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/getkeys/<i>")
def getkeys(i):
    trend_woeid=23424977
    i = int(i)
    keys_data = db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["keys"]

    return jsonify(keys_data[0:200])

@app.route("/getvaderstats/<i>")
def getvader(i):
    trend_woeid=23424977
    i = int(i)
    vader_data = db.twitter_trends_full.find({"locations.woeid": trend_woeid})[0]["trends"][i]["vader_statistics"]

    return jsonify(vader_data)

if __name__ == "__main__":
    app.run(debug=True, port=33507)

