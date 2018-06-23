var g = (function () {

  'use strict';

  var bounds = [[-20,-20], [20,20]]
  , temp
  , zoom0 = 5
  , map = L.map('map', {

    boxZoom: false // Deny box-zooms (shift + drag).
    // Explicitly mention the view parameters, so to avoid surprises.
    , center: [0, 0]
    , zoom: zoom0
    , minZoom: zoom0
    , maxZoom: zoom0 + 2
    // , bounds: bounds
    , keyboard: false

  })
  , image = L.imageOverlay('background.jpg', bounds).addTo(map)
  , geojsonLayer = new L.GeoJSON.AJAX("./.geo.json", {

    onEachFeature: function (feature, layer) {

      // layer.bindPopup('layer.feature.properties.name');

      var name = feature.properties.name;

      if(name && layer.getBounds) {
        var bounds = layer.getBounds()
        , label = L.marker(bounds.getCenter(), {
        icon: L.divIcon({
            className: 'label ' + (((bounds.getNorth() - bounds.getSouth() < 0.35) || (bounds.getEast() - bounds.getWest() < 0.7)) ? 'small' : 'big'),
            html: name,
            iconSize: [20, 20] // #Fix: Skip hardcoding the value.
          })
        }).addTo(map);
      }
    }
    , style: {

        "color": "#ff7800",
        "weight": 2,
        "opacity": 0.65
    }
  })
  , addZoomClass = function (e) { // #From: https://github.com/dagjomar/Leaflet.ZoomCSS

    var map = this
    , zoom = map.getZoom()
    , container = map.getContainer()
    ;

    container.className = container.className.replace( /\sz[0-9]{1,2}/g, '' ) + ' z' + zoom;

  };

  map.on('zoomend', addZoomClass, map);

  geojsonLayer.addTo(map);
  addZoomClass.call(map);

  return [map, geojsonLayer];

}());
