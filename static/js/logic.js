var map = L.map('map').setView([0,-40], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  L.geoJSON(data, {
    pointToLayer: function(data, latlng) {
      return L.circleMarker(latlng);
  },

    style: function ({properties:{mag},geometry:{coordinates:coord}}) {
        return {
          fillOpacity: .65,
          weight: 1,
          color: 'black',
          radius: mag*3,
          fillColor: chooseColor(coord[2]) 
        
        };
    }
}).bindPopup(function ({feature}) {
    return `<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time).toLocaleString()}<br>
    Magnitude: ${feature.properties.mag}
    </p>`;
}).addTo(map);
});


function chooseColor(depth) {
  if (depth < 10) return "#00cc00";
  else if (depth < 30) return "#80ff00";
  else if (depth < 50) return "#ffff00";
  else if (depth < 70) return "#ff5500";
  else if (depth < 90) return "#ff3333";
  else return "#ff0000";
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
    div.innerHTML += `<i style='background:${colors[i]}'>
    ${magnitudes[i]} + ${magnitudes[i + 1] ? `&ndash; ${magnitudes[i + 1]}<br>` : "+"}`;
  }
  return div;
};
legend.addTo(map);