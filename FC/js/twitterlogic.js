function buildMap(t){
   // Creating map object
    var map = L.map("map", {
    center: [37.8, -96.1],
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
    d3.json('static/data/NEWstate' + t + '.json', function(data){
    // Creating a geoJSON layer with the retrieved data
    var geojson = L.geoJson(data, {
        // Style each feature (in this case a neighborhood)
        style: function(feature) {
        var state_q = feature.properties.name;
        var colorsend = feature.properties.avg_vader;
        //var positive = feature.properties.posHEADLINEperc;
        //var negative = feature.properties.negHEADLINEperc;
        //var colorsend = positive - negative;
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
                <li class="list-group-item">Average comments for Positive Headlines: ${feature.properties.avg_vader}</li>
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
            '<b>' + props.name + '</b><br />Positive Sentiment: ' + ((props.avg_vader) * 100) + ' % ' +
            '</b><br />Negative Sentiment: ' + ((props.avg_vader) * 100) + ' % ' + 
            '</b><br />Neutral Sentiment: ' + ((props.avg_vader) * 100) + ' % '
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
}


// var tags = [{"key": "Cat", "value": 26}, 
// {"key": "fish", "value": 19}, 
// {"key": "things", "value": 18}, 
// {"key": "look", "value": 16}, {"key": "two", "value": 15},
//  {"key": "like", "value": 14}, {"key": "hat", "value": 14}]; 

function buildCloud(t){
    
  var vis_zero = d3.select("#vis");
  var svg_zero = vis_zero.selectAll("svg").remove();

  d3.json('/getkeys/' + t, function(keys){
      tags  = keys;

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
          var w = 700,
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
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selTrend");

  // Use the list of sample names to populate the select options


  d3.json('/gettrends/5', function(trends){
      i = 0;
      trends.forEach((trend) => {
          selector
            .append("option")
            .text(trend)
            .property("value", i);
            i=i+1;
        });
  });

/*     selector
        .append("option")
        .text("0")
        .property("value", 0);
  selector.append("option")
        .text("1")
        .property("value", 1); */
  buildMap(0);
  buildCloud(0);
};

function optionChanged() {
  // Fetch new data each time a new sample is selected
  selectValue = d3.select('#selTrend').property('value');
 
  map.remove();

  selector = d3.select('#contentContainer').insert("div",":first-child");
  selector.attr("class", "col-md-8").property("id","map");

  buildMap(selectValue);
  buildCloud(selectValue);
};

init();






