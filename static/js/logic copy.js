// Store our API endpoint as queryUrl.  NOTE WE ARE DOING EARTHQUACKS WITH 1.0 OR GREATER IN A WEEEK  
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  L.geoJSON(data, {
    style: function (feature) {
        return {color: feature.properties.color};
    }
}).bindPopup(function (layer) {
    return layer.feature.properties.description;
}).addTo(map);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>(feature.properties.time)}Magnitude: ${feature.properties.mag}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
   // PointToLayer: pointToLayer --POINT 

  });


  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  function pointToLayer(feature, coords) {  
          // Depth-based color calculation
  // Functipon to determine marker color
function chooseColor(depth) {
  if (depth < 10) return "#00cc00";
  else if (depth < 30) return "#80ff00";
  else if (depth < 50) return "#ffff00";
  else if (depth < 70) return "#ff5500";
  else if (depth < 90) return "#ff3333";
  else return "#ff0000";
    

     // create a function to make the markers cirles and their color 
  function pointToLayer(feature, latlng) {
  // Adjust the radius based on earthquake magnitude
     const magnitude = feature.properties.mag;
     const radius = Math.sqrt(magnitude) * 5;

  return L.circle(latlng, {
    radius: radius,
    fillColor: chooseColor(feature.geometry.coordinates[2]), 
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
  });
}

 // legend co
 var legend = L.control({
  position: "bottomright"
});
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info Legend");
  var magnitudes = [ 10, 30, 50, 70, 90, +90];
  var colors = [
    "#00cc00",
    "#80ff00",
    "#ffff00",
    "#ff5500",
    "#ff3333",
    "#ff0000"
  ];
  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML += "<i style='background: "
      + colors[i]
      + " '></i>"
      + magnitudes[i]
      + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }
  return div;
};
legend.addTo(myMap);
}

  }







};
