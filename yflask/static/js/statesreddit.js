
// Creating map object
var map = L.map("map", {
  center: [37.8, -96],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 11,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

// Function that will determine the color of a neighborhood based on the borough it belongs to
function getColor(d) {
  return d > .5 ? '#1a9850' :
         d > .4  ? '#66bd63' :
         d > .3  ? '#a6d96a' :
         d > .2  ? '#d9ef8b' :
         d > .15   ? '#fee08b' :
         d > .1   ? '#fdae61' :
         d > .05 ? '#fc8d59' :
                    '#d73027';
}
// Grabbing our GeoJSON data..
d3.json('static/data/NEWstate.json').then(function(data){
  // Creating a geoJSON layer with the retrieved data
  var geojson = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        fillColor: getColor(feature.properties.posHEADLINEperc),
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
        var location = feature.properties.name
        var url = "/getlocation?" + $(location).serialize();
        
        layer.bindPopup(`<div class="card" style="width: 18rem;">
          <div class="card-img-top" id="statechart" alt="Card image cap">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">r/${feature.properties.name}</li>
            <li class="list-group-item">Average comments on Positive Headline: ${feature.properties.posavgcomms}</li>
            <li class="list-group-item">Average Karma(IF: Title = Positive): ${feature.properties.avgKARMApos}</li>
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
    this._div.innerHTML = '<h4>State Subreddit Headlines</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + ((props.posHEADLINEperc) * 100) + ' % ' +
        '<b>' + props.name + '</b><br />' + ((props.negHEADLINEperc) * 100) + ' % '
        : 'Hover over a state');
};

info.addTo(map);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, .5, .10, .15, .2, .3, .4, .5],
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

var chart = L.control({position: 'bottomright'});
