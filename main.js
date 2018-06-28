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
    , crs: L.CRS.Simple // Use simple CRS (instead of the default, spherical), to avoid distortion of shapes near the poles.
    // Explicitly mention the view parameters, so to avoid surprises.
    , center: [0, 0]
    , zoom: zoom0
    , minZoom: zoom0
    , maxZoom: zoom0 + 3
    , maxBounds: bounds // Prevent the map from showing uncharted area.
    , maxBoundsViscosity: 1.0 // Prevent the user from dragging the map out of bounds.
    , keyboard: false

  })
  , image = L.imageOverlay('background.jpg', bounds).addTo(map)
  , geojsonLayer = new L.GeoJSON.AJAX(getQSDict().url || "./.geo.json", {

    onEachFeature: function (feature, layer) {

      var isVenue = feature.properties.type == 'venue'
      ;

      if(layer.getBounds) { // The feature is a ploygon.

        var bounds = layer.getBounds()
        , label = L.marker(bounds.getCenter(), {
        icon: L.divIcon({
            className: 'label ' + (isVenue ? 'venue' : (((bounds.getNorth() - bounds.getSouth() < 0.35) || (bounds.getEast() - bounds.getWest() < 0.7)) ? 'small' : 'big')),
            html: feature.properties.name || '',
            iconSize: [isVenue ? 100 : 20, isVenue ? 100 : 20] // #Fix: Skip hardcoding the value.
          })
        }).addTo(map);
      }
    }
    , pointToLayer: function(feature, latlng) {

      return L.marker(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
        icon: L.divIcon({
            className: 'marker',
            html: '<span class="fas fa-' + (feature.properties.marker || 'map-marker') + '"></span>',
            iconSize: [20, 20] // #Fix: Skip hardcoding the value.
          })
        })
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
