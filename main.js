var g = (function () {

  'use strict';

  var bounds = [[10,10], [30,30]]
  , map = L.map('map', {

    boxZoom: false // Deny box-zooms (shift + drag).
    , center: [20, 20]
    , zoom: 5
    , minZoom: 4
    , maxZoom: 6
    , bounds: bounds
    , keyboard: false

  }).setView([20, 20], 5);

  var image = L.imageOverlay('eibtm17.jpg', bounds).addTo(map);
  var geojsonLayer = new L.GeoJSON.AJAX("./.geo.min.json");
  geojsonLayer.addTo(map);

  return geojsonLayer;

}());
