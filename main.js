var g = (function () {

  'use strict';

  /* Helpers */
  var getQSDict = function() {

    return location.search ? JSON.parse('{"' + decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {}
  }
  , bounds = [[-22, -36], [22, 40]]
  , temp
  , zoom0 = 4
  , map = L.map('map', {

    boxZoom: false // Deny box-zooms (shift + drag).
    // Explicitly mention the view parameters, so to avoid surprises.
    , center: [0, 0]
    , zoom: zoom0
    , minZoom: zoom0
    , maxZoom: zoom0 + 3
    // , bounds: bounds
    , keyboard: false

  })
  , image = L.imageOverlay('background.jpg', bounds).addTo(map)
  , geojsonLayer = new L.GeoJSON.AJAX(getQSDict().url || "./.geo.json", {

    onEachFeature: function (feature, layer) {

      // layer.bindPopup('layer.feature.properties.name');

      var name = feature.properties.name
      , isVenue = feature.properties.type == 'venue'
      ;


      if(isVenue) {

        layer.setStyle({
          // 'fillColor': '#ff7800', // #Fix: The fill isn't added, as it isn't possible to add a class to the element here.
          // 'fillOpacity': 1
        });
      }

      if(name) {

        if(layer.getBounds) { // The feature is a ploygon.

          var bounds = layer.getBounds()
          , label = L.marker(bounds.getCenter(), {
          icon: L.divIcon({
              className: 'label ' + (isVenue ? 'venue' : (((bounds.getNorth() - bounds.getSouth() < 0.35) || (bounds.getEast() - bounds.getWest() < 0.7)) ? 'small' : 'big')),
              html: name,
              iconSize: [isVenue ? 100 : 20, isVenue ? 100 : 20] // #Fix: Skip hardcoding the value.
            })
          }).addTo(map);
        }
        else {

          var label = L.marker(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
          icon: L.divIcon({
              html: name,
              iconSize: [20, 20] // #Fix: Skip hardcoding the value.
            })
          }).addTo(map);
        }
      }
      else {

        var marker = feature.properties.marker;

        if(marker) {

          var label = L.marker(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
          icon: L.divIcon({
              className: 'marker',
              html: '<span class="fas fa-' + feature.properties.marker + '"></span>',
              iconSize: [20, 20] // #Fix: Skip hardcoding the value.
            })
          }).addTo(map);
        }
        else {

          if(layer.getBounds) {

            // layer.setStyle({
            // 'fillColor': '#f7f7f7',
            // 'fillOpacity': 1
            // });
          }
        }
      }
    }
    , style: {

        "color": "#e0d4c6",
        "fill": true,
        "fillColor": "#fff8ea",
        "weight": 2,
        "opacity": 1,
        // "fillOpacity": 1
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
