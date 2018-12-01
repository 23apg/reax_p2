function buildMap(){
var basemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 11,
  id: "mapbox.light",
  accessToken: API_KEY
});

var layers = {
  CITIES: new L.LayerGroup(),
};

// Creating map object
var map = L.map("map", {
  center: [37.8, -96],
  zoom: 4,
  layers:[
    layers.CITIES,
  ]
});

basemap.addTo(map);

var overlays = {
  "Cities": layers.CITIES
}

L.control.layers(null, overlays,{
  position : 'bottomright'}).addTo(map);



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
var italybrazil = d3.json('static/data/2NEWstate.json', function(data){
  // Creating a geoJSON layer with the retrieved data
  var geojson = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      var positive = +feature.properties.posHEADLINEperc;
      var negative = +feature.properties.negHEADLINEperc;
      var colorsend = positive - negative
      // var colorsend = (positive > (negative));
      // console.log(colorsend);


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
        var loc = feature.properties.name;
        let location = loc.replace(/ /g,'');
   
        console.log('location: ', location);
        
        buildCloud(location);
        
        
        layer.bindPopup(`<div class="card" style="width: 18rem;">
          <div class="card-img-top" id="statechart" alt="Card image cap">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">r/${feature.properties.name}</li>
            <li class="list-group-item">Average comments for Positive Headlines: ${feature.properties.posavgcomms}</li>
            <li class="list-group-item">Average Karma for Positive Headlines: ${feature.properties.avgKARMApos}</li>
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
    this._div.innerHTML = '<h4>State Subreddit Headlines</h4>' +  (props ?
        '<b>' + props.name + '</b><br />Positive Sentiment: ' + ((props.posHEADLINEperc) * 100) + ' % ' +
        '</b><br />Negative Sentiment: ' + ((props.negHEADLINEperc) * 100) + ' % ' + 
        '</b><br />Neutral Sentiment: ' + ((props.neuHEADLINEperc) * 100) + ' % '
        : 'Hover over a state');
};

info.addTo(map);


var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-1, -.2, -.1, -.05,  0, .075, .15, .25],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash; ' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

cityMarkers = [];



d3.json('static/data/cityreddit.json',function(data){
  console.log('><><><',data);
  for(var i = 0; i < data.cities.length; i++) {
    // var pcCITY = data.cities[i]['posHEADLINEperc'];
    // var ncCITY = data.cities[i]['negHEADLINEperc'];
    // // var cd = pcCITY - ncCITY
    // console.log(cd);
    var newMarker = L.marker(data.cities[i]['ll']);

    newMarker.addTo(layers.CITIES);
    newMarker.bindPopup(`<div class="card" style="width: 18rem;">
    <div class="card-img-top" id="statechart" alt="Card image cap">
    <ul class="list-group list-group-flush">
      <li class="list-group-item">r/${data.cities[i]['city']}</li>
      <li class="list-group-item">Average comments for Positive Headlines: ${data.cities[i]['posavgcomms']}</li>
      <li class="list-group-item">Average Karma for Positive Headlines: ${data.cities[i]['posHEADLINEperc']}</li>
      <li class="list-group-item">Average comments for Negative Headlines: ${data.cities[i]['negavgcomms']}</li>
      <li class="list-group-item">Average Karma for Negative Headlines: ${data.cities[i]['negHEADLINEperc']}</li>
      <li class="list-group-item">Average comments for Neutral Headlines: ${data.cities[i]['neuavgcomms']}</li>
      <li class="list-group-item">Average Karma for Neutral Headlines: ${data.cities[i]['neuavgcomms']}</li>
    </ul>
  </div>`);

  }

});
// buildmap close
};

function buildCloud(s){
    
  var vis_zero = d3.select("#vis");
  var svg_zero = vis_zero.selectAll("svg").remove();

  

  d3.json('/getredditkeys/' + s, function(keys){
      tags  = keys;
      d3.selectAll('h1').text("Data: r/" + s + "'s Headlines");

      var fill = d3.scale.category20b();

      //var w = window.innerWidth,
              //h = window.innerHeight;
              var w = 500,
              h = 500;
      var max,
              fontSize;

      var layout = d3.layout.cloud()
              .timeInterval(Infinity)
              .size([w, h])        
              //.size([500, 500])
              .fontSize(function(d) {
                  return fontSize(+d.value);
              })
              .text(function(d) {
                  return d.key;
              })
              .on("end", draw);

      var svg_cloud = d3.select("#vis").append("svg")
              .attr("width", w)
              .attr("height", h);

      var vis = svg_cloud.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

      update();


      //if(window.attachEvent) {
          //window.attachEvent('onresize', update);
      //}
      //else if(window.addEventListener) {
          //window.addEventListener('resize', update);
      //}

      function draw(data, bounds) {
          var w = 600,
              h = 500;

            svg_cloud.attr("width", w).attr("height", h);

          scale = bounds ? Math.min(
                  w / Math.abs(bounds[1].x - w / 2),
                  w / Math.abs(bounds[0].x - w / 2),
                  h / Math.abs(bounds[1].y - h / 2),
                  h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

          var text = vis.selectAll("text")
                  .data(data, function(d) {
                      return d.text.toLowerCase();
                  });
          text.transition()
                  .duration(1000)
                  .attr("transform", function(d) {
                      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                  .style("font-size", function(d) {
                      return d.size + "px";
                  });
          text.enter().append("text")
                  .attr("text-anchor", "middle")
                  .attr("transform", function(d) {
                      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                  .style("font-size", function(d) {
                      return d.size + "px";
                  })
                  .style("opacity", 1e-6)
                  .transition()
                  .duration(1000)
                  .style("opacity", 1);
          text.style("font-family", function(d) {
              return d.font;
          })
                  .style("fill", function(d) {
                      return fill(d.text.toLowerCase());
                  })
                  .text(function(d) {
                      return d.text;
                  });

          vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
      }

      function update(){

              layout.font('impact').spiral('archimedean');
              fontSize = d3.scale['sqrt']().range([10, 100]);
              if (tags.length){
                  fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
              }
              layout.stop().words(tags).start();
          
      }
  })
};

buildMap();
buildCloud('California');