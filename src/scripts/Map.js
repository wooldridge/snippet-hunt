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
      mapStyles,
      map,
      myLat,
      myLon,
      player,

      // methods
      getMapOptions,
      showMap,
      showMarkers,
      showPlayer,
      getPlayer;

  // initialize properties
  config = config || {};

  id = config.id || 'map-canvas';

  getMapOptions = function () {
    mapStyles = new APP.MapStyles();
    var options = {
      center: new google.maps.LatLng(config.myLat, config.myLon),
      zoom: 18,
      panControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      maxZoom: 20,
      minZoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: mapStyles.getStyle(config.style)
    };
    $.extend(options, config.mapOptions);
    return options;
  };

  showMap = function () {
    map = new google.maps.Map(document.getElementById(id), getMapOptions());
    $('#' + id).trigger('showMapDone');
  };

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
    showMarkers: showMarkers,
    showPlayer: showPlayer,
    getPlayer: getPlayer
  };

};
