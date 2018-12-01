


// // Create a map object
// var myMap = L.map("map", {
//   center: [43.5260 , -111.2551],
//   zoom: 4
// });

// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.light",
//   accessToken: API_KEY
// }).addTo(myMap);




d3.json('static/data/state.json').then(function(data){
  console.log(data);
  console.log(data.features.properties.NAME);
//   L.geoJSON(data).addTo(myMap);
// });
// use lines 20 - 23 or 26 - 27
  createFeatures(data.features);
});

function createFeatures(stateData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.NAME +
    "</h3><hr><p>" + feature.properties.CENSUSAREA + "</p>");
  }

  var statesd = L.geoJSON(stateData, {
    onEachFeature: onEachFeature
  });
  createMap(statesd);
}

function createMap(statesd) {

  var statemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }); 

  var placeholdermap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }); 

  var baseMaps = {
    "State Map": statemap,
    "Placeholder Map": placeholdermap
  };

  var overlayMaps = {
    States: statesd
  };

  var myMap = L.map("map", {
    center: [43.5260 , -111.2551],
    zoom: 4,
    layers: [placeholdermap, statemap]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}