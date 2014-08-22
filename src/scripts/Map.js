var APP = APP || {};

/**
 * Class representing the game map.
 * @constructor
 * @param config A configuration object.
 */
APP.Map = function (config, bounds) {
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
      showMarkers,
      showPlayer,
      getPlayer;

  // initialize properties
  config = config || {};

  id = config.id || 'map-canvas';

  getMapOptions = function () {
    var options = {
      center: new google.maps.LatLng(config.myLat, config.myLon),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: config.mapStyles.getStyle(config.style)
    };
    $.extend(options, config.mapOptions);
    return options;
  };

  showMap = function () {
    map = new google.maps.Map(document.getElementById(id), getMapOptions());
    $('#' + id).trigger('showMapDone');
  };

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

  showRectangle = function () {
    rectBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(config.lat1, config.lon1),
      new google.maps.LatLng(config.lat2, config.lon2)
    );

    rectOptions = {
      bounds: rectBounds,
      editable: true,
      draggable: true
    }
    $.extend(rectOptions, config.rectOptions);

    rectangle = new google.maps.Rectangle(rectOptions);

    rectangle.setMap(map);
  }

  showMarkers = function (things) {
    for (var i = 0; i < things.length; i++) {
      things[i].showMarker(map);
    }
    $('#' + id).trigger('showMarkersDone');
  };

  showPlayer = function () {
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

  // Public API
  return {
    showMap: showMap,
    loadMapTypes: loadMapTypes,
    setMapType: setMapType,
    showRectangle: showRectangle,
    showMarkers: showMarkers,
    showPlayer: showPlayer,
    getPlayer: getPlayer
  };

};
