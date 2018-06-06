(function () {
  'use strict';

  var map = L.map('map').setView([20, 20], 5);
  var geojsonLayer = new L.GeoJSON.AJAX("./.geo.min.json");
  geojsonLayer.addTo(map);

}());
