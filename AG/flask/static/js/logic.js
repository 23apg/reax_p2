


// Create a map object
var myMap = L.map("map", {
  center: [54.5260 , -95.2551],
  zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);




d3.json('static/data/state.json').then(function(data){
  console.log(data);
  console.log("hello world");
  L.geoJSON(data).addTo(myMap);
});

// var stateurl = "/statelatlong";
// d3.json(stateurl).then(function(statedata){
//   console.log(statedata);
// //   // statedata.forEach(function (data){
// //   //   var states = [{
// //   //     name: data.location,


// //   //   }];
// //   // )
// });

// var cityurl = "/citylatlong";
// d3.json(cityurl).then(function(citydata){
//   // console.log(citydata);

//   var cd = citydata.slice(0,100);
//   console.log(cd)
//   cd.forEach(d => {
//   var cities = [{
//   name: d.location,
//   location: [`${d.lat}`, `${d.long}`],
//   population: +d.population
//   }];
//   });
// });

// Country data
// var countries = [
//   {
//     name: "Brazil",
//     location: [-14.2350, -51.9253],
//     points: 227
//   },
//   {
//     name: "Germany",
//     location: [51.1657, 10.4515],
//     points: 218
//   },
//   {
//     name: "Italy",
//     location: [41.8719, 12.5675],
//     points: 156
//   },
//   {
//     name: "Argentina",
//     location: [-38.4161, -63.6167],
//     points: 140
//   },
//   {
//     name: "Spain",
//     location: [40.4637, -3.7492],
//     points: 99
//   },
//   {
//     name: "England",
//     location: [52.355, 1.1743],
//     points: 98
//   },
//   {
//     name: "France",
//     location: [46.2276, 2.2137],
//     points: 96
//   },
//   {
//     name: "Netherlands",
//     location: [52.1326, 5.2913],
//     points: 93
//   },
//   {
//     name: "Uruguay",
//     location: [-32.4228, -55.7658],
//     points: 72
//   },
//   {
//     name: "Sweden",
//     location: [60.1282, 18.6435],
//     points: 61
//   }
// ];


// // Loop through the cities array and create one marker for each city object
// for (var i = 0; i < cities.length; i++) {

//   // Conditionals for countries points
//   var color = "";
//   if (cities[i].population > 2000000) {
//     color = "yellow";
//   }
//   else if (cities[i].population > 1000000) {
//     color = "blue";
//   }
//   else if (cities[i].population > 500000) {
//     color = "green";
//   }
//   else if (cities[i].population > 250000) {
//     color = "red";
//   }
//   else {
//     color = "orange";
//   }

//   // Add circles to map
//   L.circle(cities[i].location, {
//     fillOpacity: 0.5,
//     color: "white",
//     fillColor: color,
//     // Adjust radius
//     radius: cities[i].population 
//   }).bindPopup("<h1>" + cities[i].name + "</h1> <hr> <h3>Points: " + cities[i].population + "</h3>").addTo(myMap);
// }
