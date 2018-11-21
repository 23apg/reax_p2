var stateSentArray = [];

var ssentMap = {};
var stateSent = d3.json('/statered_sent').then(function(ssentData){ 
  // console.log('******ssentData', ssentData); 
  stateSentArray = ssentData;    
  // console.log('**************', stateSentArray);
  for(var i=0; i<stateSentArray.cursor.length; i++){
    // console.log('*******', stateSentArray.cursor[i]['location']);
    ssentMap[stateSentArray.cursor[i]['location']]  = {
      'karmaUp' : stateSentArray.cursor[i]['karmaUp'],
      'vaderCom':stateSentArray.cursor[i]['vaderCom'],
      'vaderNeg':stateSentArray.cursor[i]['vaderNeg'],
      'vaderPos':stateSentArray.cursor[i]['vaderPos']
    }
  }   
});

console.log('************ssentMap', ssentMap);




console.log('********', ssentMap);

d3.json('/cityred_sent').then(function(data){
  console.log(data);
});


// function chooseColor(statelsad) {
//   console.log(statelsad);
//   switch (statelsad) {  
//   case (statelsad <= 1 && statelsad > .5):
//     return "green";
//   case (statelsad <= .5 && statelsad > .0):
//     return "black";
//   case (statelsad <= 0 && statelsad > -0.5):
//     return "orange";
//   case (statelsad <= -0.5 && statelsad >= -1):
//     return "red";
//   }
// }



d3.json('static/data/NEWstate.json').then(function(data){
  createFeatures(data.features);

});

function createFeatures(stateData) {

  function onEachFeature(feature, layer) {
    


    //format properties name
    var stk = feature.properties.NAME;
    var statek = stk.toLowerCase();
    var statekey = statek.replace(/ /g,'');
    // console.log(statekey);
    if (ssentMap.hasOwnProperty(statekey) ){
    bardata = [{
      x: [feature.properties.LSAD.vaderCom, feature.properties.LSAD.vaderNeg, feature.properties.LSAD.vaderPos],
      y: ['Composite Score', 'Negative Score', 'Positive Score'],
      type: 'bar'
    }];
    layer.bindPopup(`<div class="card" style="width: 18rem;">
                    <div class="card-img-top" id="statechart" alt="Card image cap">
                        <ul class="list-group list-group-flush"><li class="list-group-item">${feature.properties.NAME}</li>
                          <li class="list-group-item">State's Sub Positive Karma: ${feature.properties.LSAD.karmaUp}</li>

                          <li class="list-group-item">State Population: ${feature.properties.CENSUSAREA}</li>
                        </ul>
                      </div>`
                      );

    layer.on()
      
      
      
      }
    else {
    layer.bindPopup(`<div class="card" style="width: 18rem;">
    <ul class="list-group list-group-flush">
    <li class="list-group-item">${feature.properties.NAME}</li>
      <li class="list-group-item">${feature.properties.CENSUSAREA}</li>
      <li class="list-group-item">Too many sinners?</li>
    </ul>
  </div>`) }
  };

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