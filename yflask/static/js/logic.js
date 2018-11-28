
var twitterARRAY = []
var twitterMAP = {}
var citiesARRAY = []

d3.json('/cityclusters').then(function(tD) {
  // console.log(tD);
  twitterARRAY = tD

  for (var i=0; i < twitterARRAY.cursor.length; i++){
    citiesARRAY.push(twitterARRAY.cursor[i]['coordinates'][0]['city']);
    twitterMAP[twitterARRAY.cursor[i]['coordinates'][0]['city']] = {
    'state' : twitterARRAY.cursor[i]['coordinates'][0]['state'], 
    'lat' :  twitterARRAY.cursor[i]['coordinates'][0]['latitude'] , 
    'long' : twitterARRAY.cursor[i]['coordinates'][0]['longitude'] ,
    'trend1' : twitterARRAY.cursor[i]['trends'][0]['name'],
    'tweetvol1':twitterARRAY.cursor[i]['trends'][0]['tweet_volume'],
    'trend2' : twitterARRAY.cursor[i]['trends'][1]['name'],
    'tweetvol2':twitterARRAY.cursor[i]['trends'][1]['tweet_volume'],
    'trend3' : twitterARRAY.cursor[i]['trends'][2]['name'],
    'tweetvol3':twitterARRAY.cursor[i]['trends'][2]['tweet_volume'],}
  }

  // console.log('**********', JSON.stringify(twitterMAP));

//   for (var key in twitterMAP) {
//   console.log(twitterMAP[key]);
// };
});

// console.log(citiesARRAY);




// console.log((twitterMAP));
// function createMarkers(response) {
  
//   var twitterARRAY = []
//   twitterARRAY = response
//   latlong = []

//   for (var i=0; i < twitterARRAY.cursor.length; i++){
//     var citymarker = L.marker([twitterARRAY.cursor[i]['coordinates'][0]['latitude'], twitterARRAY.cursor[i]['coordinates'][0]['longitude'] ])
//       .bindPopup(`<div class="card" style="width: 18rem;">
//       <div class="card-img-top" id="statechart" alt="Card image cap">
//       <ul class="list-group list-group-flush">
//         <li class="list-group-item">r/${twitterARRAY.cursor[i]['trends'][0]['name']}</li>
//         <li class="list-group-item"> ${twitterARRAY.cursor[i]['trends'][1]['name']}</li>
//         <li class="list-group-item">${twitterARRAY.cursor[i]['trends'][2]['name']}</li>
//       </ul>
//       </div>`);
//     latlong.push(citymarker);
//   }
//   latlong.addTo(map);
// }
// d3.json('/cityclusters', createMarkers);

// Creating map object
var map = L.map("map", {
  center: [37.8, -96],
  zoom: 5,
  layers: basemap
});


var basemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 11,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);




// Function that will determine the color of a neighborhood based on the borough it belongs to
function getColor(d) {
  
  return d > .25 ? '#2166ac' :
         d > .15  ? '#4393c3' :
         d > .075  ? '#92c5de' :
         d > 0  ? '#d1e5f0' :
         d > -.05   ? '#fddbc7' :
         d > -.1   ? '#f4a582' :
         d > -.2 ? '#d6604d' :
         d > -1 ? '#b2182b' :
                    '#d73027';
}
// Grabbing our GeoJSON data..
d3.json('static/data/NEWstate.json').then(function(data){
  // Creating a geoJSON layer with the retrieved data
  var geojson = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      var positive = feature.properties.posHEADLINEperc;
      var negative = feature.properties.negHEADLINEperc;
      var colorsend = positive - negative
      // var colorsend = (positive > (negative));
      console.log(colorsend)


      return {
        fillColor: getColor(colorsend),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    },

    // Called on each feature
    onEachFeature: function(feature, layer) {


      function highlightFeature(e) {
        var layer = e.target;
        info.update(layer.feature.properties);
  
    
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
      }
      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
      }

      function zoomToFeature(e) { 
        let location = feature.properties.name;

        console.log('location: ', location);
    
        layer.bindPopup(`<div class="card" style="width: 18rem;">
          <div class="card-img-top" id="statechart" alt="Card image cap">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">r/${feature.properties.name}</li>
            <li class="list-group-item">Average comments for Positive Headlines: ${feature.properties.posavgcomms}</li>
            <li class="list-group-item">Average comments for Positive Headlines: ${feature.properties.avgKARMApos}</li>
            <li class="list-group-item">Average comments for Negative Headlines: ${feature.properties.negavgcomms}</li>
            <li class="list-group-item">Average Karma for Negative Headlines: ${feature.properties.avgKARMAneg}</li>
            <li class="list-group-item">Average comments for Neutral Headlines: ${feature.properties.neuavgcomms}</li>
            <li class="list-group-item">Average Karma for Neutral Headlines: ${feature.properties.avgKARMAneu}</li>
          </ul>
        </div>`
        );
        map.fitBounds(e.target.getBounds());
      }

      
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
          });
        },
    
  }).addTo(map);
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>State Subreddit Headlines (%)</h4>' +  (props ?
        '<b>' + props.name + '</b><br />Positive Sentiment: ' + ((props.posHEADLINEperc) * 100) + ' % ' +
        '</b><br />Negative Sentiment: ' + ((props.negHEADLINEperc) * 100) + ' % ' + 
        '</b><br />Neutral Sentiment: ' + ((props.neuHEADLINEperc) * 100) + ' % '
        : 'Hover over a state');
};

info.addTo(map);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, .05, .10, .15, .2, .3, .4, .5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
