var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//create a GeoJSON layer with earthquake data from the features
d3.json(quakeURL, function(quakeData) {
  
  console.log(quakeData.features)

  //create a layer for L.circleMarker with popup from quakeData
  var earthQuakes = L.geoJSON(quakeData, {
    pointToLayer: function (quakes, latlng) {
      return L.circleMarker(latlng, {
        radius: quakes.properties.mag*3,
        fillColor: getColor(quakes.properties.mag),
        fillOpacity: .75,
        opacity: 1,
        stroke: false,}).bindPopup("Location: " + quakes.properties.place +"<br>Magnitude: " + quakes.properties.mag + "<br> Depth: " + quakes.geometry.coordinates[2])},     
      })
    
    createMap(earthQuakes)
    })


//see https://stackoverflow.com/questions/37357755/assign-color-of-leaflet-circlemarker-to-range-of-values
function getColor(mag) { 
  return mag > 8 ? '#660033':
  mag > 7 ? '#99004d':
  mag > 6 ? '#cc0066':
  mag > 5 ? '#ff0080':
  mag > 4 ? '#ff3399':
  mag > 3 ? '#ff66b3':
  mag > 2 ? '#ff99cc':
  mag > 1 ? '#ffcce6':
 '#ffffff';}

function createMap(earthQuakes) {

  // Create the tile layer that will be the background of our map
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", 
  {attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the streets and lightmap map layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the earthquake layer
  var overlayMaps = {
    "Earthquakes": earthQuakes
  };

  // Create the map object with options
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [lightmap, earthQuakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

var legend = L.control({position: 'topleft'});
//https://gis.stackexchange.com/questions/158227/leaflet-geojson-problem-with-style
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend'),
  grades = [8, 7, 6, 5, 4, 3, 2, 1],
  labels = [];

  //legend Title
  var legendTitle = "Magnitude of Earthquake"
  div.innerHTML = legendTitle
  
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<li style="background:' + getColor(grades[i] + 1) + '"></li> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

  legend.addTo(myMap);
}

