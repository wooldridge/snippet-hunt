var APP = APP || {};

/**
 * Class representing the game map.
 * @constructor
 * @param config A configuration object.
 */
APP.Map = function (config) {
  'use strict';
      // properties
  var id, // HTML container ID, e.g. 'map-canvas'
      mapType,
      rectBounds,
      rectOptions,
      rectangle,
      map,
      myLat,
      myLon,
      player,

      // methods
      getMapOptions,
      showMap,
      loadMapTypes,
      setMapType,
      showRectangle,
      getRectangle,
      disableRectangle,
      showMarkers,
      showPlayer,
      getPlayer,
      getMap;

  // initialize properties
  config = config || {};

  id = config.id || 'map-canvas';

  getMapOptions = function () {
    var options = {
      center: new google.maps.LatLng(config.myLat, config.myLon),
    };
    if (config.mapStyles) {
      options.styles = config.mapStyles.getStyle(config.style);
    }
    $.extend(options, config.mapOptions);
    return options;
  };

  showMap = function () {
    map = new google.maps.Map(document.getElementById(id), getMapOptions());
    $('#' + id).trigger('showMapDone');
  };

  // @see https://developers.google.com/maps/documentation/javascript/maptypes
  loadMapTypes = function (mapStyleIds) {
    $.each(mapStyleIds, function (i, s) {
      mapType = new google.maps.StyledMapType(
        config.mapStyles.getStyle(s),
        {
          map: map,
          name: s
        }
      );
      map.mapTypes.set(s, mapType);
    });
  };

  setMapType = function (styleId) {
    map.setMapTypeId(styleId);
  };

  showRectangle = function (bounds) {
    rectBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(bounds.getLat1(), bounds.getLon1()),
      new google.maps.LatLng(bounds.getLat2(), bounds.getLon2())
    );
    rectOptions = {
      bounds: rectBounds,
      editable: true,
      draggable: true
    }
    $.extend(rectOptions, config.rectOptions);
    rectangle = new google.maps.Rectangle(rectOptions);
    rectangle.setMap(map);
    // Handle rectangle change
    // @see https://developers.google.com/maps/documentation/javascript/examples/rectangle-event
    google.maps.event.addListener(rectangle, 'bounds_changed', function (event) {
      var ne = rectangle.getBounds().getNorthEast();
      var sw = rectangle.getBounds().getSouthWest();
      $('#' + id).trigger('rectChanged', [sw.lat(), ne.lng(), ne.lat(), sw.lng()]);
    });
  };

  getRectangle = function () {
    return rectangle;
  };

  disableRectangle = function () {
    rectangle.setEditable(false);
    rectangle.setDraggable(false);
  };

  // @todo Move this method to Things, showMarkers(map);
  showMarkers = function (things) {
    for (var i = 0; i < things.length; i++) {
      things[i].showMarker(this, true);
    }
    $('#' + id).trigger('showMarkersDone');
  };

  showPlayer = function () {
    if (!map) {
      showMap();
    }
    var playerConfig = {
        radius: 20,
        fillOpacity: 0.1,
        strokeOpacity: 0.2
    };
    player = new GeolocationMarker(map, {}, playerConfig);

    $('#' + id).trigger('showPlayerDone');
  };

  getPlayer = function () {
    return player
  };

  getMap = function () {
    return map
  };

  // Public API
  return {
    showMap: showMap,
    loadMapTypes: loadMapTypes,
    setMapType: setMapType,
    showRectangle: showRectangle,
    getRectangle: getRectangle,
    disableRectangle: disableRectangle,
    showMarkers: showMarkers,
    showPlayer: showPlayer,
    getPlayer: getPlayer,
    getMap: getMap
  };

};
