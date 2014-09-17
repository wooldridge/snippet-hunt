var APP = APP || {};

/**
 * Class representing a map Marker.
 * @constructor
 * @param config A Marker config object.
 */
APP.Marker = function (config) {
    'use strict';
        // properties
    var lat,
        lon,
        pos,
        marker,
        map,
        title,
        icon,
        zIndex,
        size,
        markerIcon,
        markerIconActive,
        markerIconSmall,
        markerIconSmallActive,
        markerIconTiny,
        markerIconTinyActive,
        limit,
        gameBounds,

        // methods
        getMarker,
        getType,
        setType,
        getName,
        setName,
        getLat,
        setLat,
        getLon,
        setLon,
        getSize,
        setSize,
        getZIndex,
        setZIndex,
        getMarker,
        getMarkerIcon,
        getMarkerIconActive,
        showMarker,
        makeInteractive,
        hideMarker,
        setMarkerIcon;

    // initialize properties
    config = config || {};

    // location: 37.886, -122.064

    lat = config.lat;
    lon = config.lon;
    pos = new google.maps.LatLng(getLat(), getLon());

    map = config.map;
    name = config.name || '';
    zIndex = config.zIndex || 1;
    size = config.size || 'large';

    icon = {
      size: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(20, 20)
    };
    markerIcon = $.extend({}, icon, {url: 'images/' + type + '_lg.png'});
    markerIconActive = $.extend({}, icon, {url: 'images/' + type + '_lg_lt.png'});
    markerIconSmall = $.extend({}, icon, {url: 'images/' + type + '_sm.png'});
    markerIconSmallActive = $.extend({}, icon, {url: 'images/' + type + '_sm_lt.png'});
    markerIconTiny = {};
    markerIconTinyActive = {};

    markerSize = 'large'; // default, will change with zooming

    // Relative zoom sizes:
    // Zoom 20 = 260px
    // Zoom 19 = 130px
    // Zoom 18 = 65px
    // Zoom 17 = 32px
    // Zoom 16 = 16px

    // Limit for interacting with Thing (in meters)
    limit = config.limit || 20;

    /**
     * Get the ID
     * @returns The ID
     */
    getId = function () {
        return id;
    };

    /**
     * Set the ID
     * @returns The ID
     */
    setId = function (theId) {
        id = theId;
    };

    /**
     * Get the type
     * @returns The type
     */
    getType = function () {
        return type;
    };

    /**
     * Set the type
     * @returns The type
     */
    setType = function (theType) {
        type = theType;
    };

    /**
     * Get the name
     * @returns The name
     */
    getName = function () {
        return name;
    };

    /**
     * Set the name
     * @returns The name
     */
    setName = function (theName) {
        name = theName;
    };

    /**
     * Get the latitude
     * @returns The latitude
     */
    getLat = function () {
        return lat;
    };

    /**
     * Set the latitude
     * @param newLat The new latitude
     */
    setLat = function (newLat) {
        lat = newLat;
    };

    /**
     * Get the longitude
     * @returns The longitude
     */
    getLon = function () {
        return lon;
    };

    /**
     * Set the longitude
     * @param newLon The new longitude
     */
    setLon = function (newLon) {
        lon = newLon;
    };

    /**
     * Get the size
     * @returns The size
     */
    getSize = function () {
        return size;
    };

    /**
     * Set the size
     * @param val The new size
     */
    setSize = function (newSize) {
        value = newSize;
    };

    /**
     * Get the zIndex
     * @returns The zIndex
     */
    getZIndex = function () {
        return zIndex;
    };

    /**
     * Set the zIndex
     * @param newZ The new zIndex
     */
    setZIndex = function (newZ) {
        zIndex = newZ;
    };

    getMarker = function () {
      if (marker) {
        return marker;
      } else {
        return null;
      }
    };

    getMarkerIcon = function () {
      switch(size) {
        case 'large':
          return markerIcon;
        case 'small':
          return markerIconSmall;
        case 'tiny':
          return markerIconTiny;
        default:
          return null;
      }
    };

    getMarkerIconActive = function () {
      switch(size) {
        case 'large':
          return markerIconActive;
        case 'small':
          return markerIconSmallActive;
        case 'tiny':
          return markerIconTinyActive;
        default:
          return null;
      }
    };

    /**
     * Show a Thing marker on a Google Map
     * @param map The APP.Map object
     * @param {boolean} interactive Add event handling (true or false)
     */
    showMarker = function (map, interactive) {
        marker = new google.maps.Marker({
          position: pos,
          map: map.getMap(),
          title: name,
          icon: getMarkerIcon(size),
          zIndex: zIndex
        });
        if (interactive !== false) {
          makeInteractive();
        }
    };

    /**
     * Add events to make marker interactive
     */
    makeInteractive = function () {
      google.maps.event.addListener(marker, 'click', function(ev) {
        var player = map.getPlayer();
        var dist = getDistBetwPoints(
          getLat(),
          getLon(),
          player.position.k,
          player.position.B
        );
        marker.setIcon(getMarkerIconActive());
        var msg;
        if (dist * 1000 > limit) {
          msg = getName() + ' out of range';
          var sndE = new Audio("audio/error2.mp3");
          sndE.play();
          setTimeout(function() {
            marker.setIcon(getMarkerIcon());
          }, 500);
          $('#msg').show().html(msg).delay(1000).fadeOut(1000);
        } else {
          msg = 'You got ' + getName() + '!';
          var sndO = new Audio("audio/ok2.mp3");
          sndO.play();
          setTimeout(function() {
            marker.setMap(null);
          }, 200);
          $('#msg').show().html(msg).delay(1000).fadeOut(1000);
          APP.game.changeScore(getValue());
          $('#map-canvas').trigger('scoreChanged');
          APP.game.displayScore();
          $('#map-canvas').trigger('deleteThing', [id]);
        }
        console.log(msg + ': ' + getId());
      });
    };


    /**
     * Hide a Thing marker on a Google Map
     * @param map The Google Map
     */
    hideMarker = function () {
        marker.setMap(null);
        console.log('marker hidden: ' + getId());
    };

    setMarkerIcon = function () {
      if (size === 'small') {
        marker.setIcon(markerIconSmall);
      } else if (size === 'large') {
        marker.setIcon(markerIcon);
      } else if (size === 'tiny') {
        marker.setIcon(markerIconTiny);
      }
      if (size === 'tiny') {
        marker.setClickable(false);
      } else {
        marker.setClickable(true);
      }
    };

    // Public API
    return {
        getId: getId,
        setId: setId,
        getType: getType,
        setType: setType,
        getName: getName,
        setName: setName,
        getLat: getLat,
        setLat: setLat,
        getLon: getLon,
        setLon: setLon,
        getSize: getSize,
        setSize: setSize,
        getZIndex: getZIndex,
        setZIndex: setZIndex,
        getMarker: getMarker,
        getMarkerIcon: getMarkerIcon,
        getMarkerIconActive: getMarkerIconActive,
        showMarker: showMarker,
        makeInteractive: makeInteractive,
        hideMarker: hideMarker,
        setMarkerIcon: setMarkerIcon
    };

};

module.exports = APP.Marker;
