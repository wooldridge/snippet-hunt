var APP = APP || {};

var module = {};

/**
 * Class representing a map Marker.
 * @constructor
 * @param config A Marker config object.
 */
APP.Marker = function (config) {
    'use strict';
        // properties
    var id,
        lat,
        lon,
        pos,
        title,
        icon,
        zIndex,
        size,
        type,
        limit,
        value,
        googleMarker,
        markerIcon,
        markerIconActive,
        markerIconSmall,
        markerIconSmallActive,
        markerIconTiny,
        markerIconTinyActive,

        // methods
        getId,
        setId,
        getLat,
        setLat,
        getLon,
        setLon,
        getName,
        setName,
        getSize,
        setSize,
        getZIndex,
        setZIndex,
        getType,
        setType,
        getValue,
        setValue,
        getGoogleMarker,
        getMarkerIcon,
        getMarkerIconActive,
        showMarker,
        getDistBetwPoints,
        deg2rad,
        makeInteractive,
        hideMarker,
        setMarkerIcon;

    // initialize properties
    config = config || {};

    id = config.id || 0;

    // location: 37.886, -122.064

    lat = config.lat || 0;
    lon = config.lon || 0;
    pos = new google.maps.LatLng(lat, lon);

    name = config.name || '';
    size = config.size || 'large';
    zIndex = config.zIndex || 1;
    type = config.type || '';
    value = config.value || 1;
    limit = config.limit || 30; // @todo currently not passed in

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

    // Relative zoom sizes:
    // Zoom 20 = 260px
    // Zoom 19 = 130px
    // Zoom 18 = 65px
    // Zoom 17 = 32px
    // Zoom 16 = 16px

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
        size = newSize;
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

    /**
     * Get the type
     * @returns The type
     */
    getType = function () {
        return type;
    };

    /**
     * Set the type
     * @param newType The new type
     */
    setType = function (newType) {
        type = newType;
    };


    /**
     * Get the value
     * @returns The value
     */
    getValue = function () {
        return value;
    };

    /**
     * Set the value
     * @param newValue The new value
     */
    setValue = function (newValue) {
        value = newValue;
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

    getGoogleMarker = function () {
      return googleMarker || null;
    };

    /**
     * Show a marker on a Google Map
     * @param map The APP.Map object
     */
    showMarker = function (map) {
        googleMarker = new google.maps.Marker({
          position: pos,
          map: map.getMap(),
          title: name,
          icon: getMarkerIcon(size),
          zIndex: zIndex
        });
    };

   getDistBetwPoints = function (lat1,lon1,lat2,lon2) {
      if (!lat1 || !lon1 || !lat2 || !lon2) {
        throw new Error("Missing lat/lon param(s)");
      }
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    };

    deg2rad = function (deg) {
      return deg * (Math.PI/180);
    };

    /**
     * Add events to make marker interactive
     * @param map The APP.Map object
     */
    makeInteractive = function (map) {
      var currName = getName();
      google.maps.event.addListener(googleMarker, 'click', function(ev) {
        var player = map.getPlayer();
        var dist = getDistBetwPoints(
          getLat(),
          getLon(),
          player.position.k,
          player.position.B
        );
        googleMarker.setIcon(getMarkerIconActive());
        var msg;
        if (dist * 1000 > limit) { // @todo hardcoded limit, fix
          msg = currName + ' out of range';
          var sndE = new Audio("audio/error2.mp3");
          sndE.play();
          setTimeout(function() {
            googleMarker.setIcon(getMarkerIcon());
          }, 500);
          $('#msg').show().html(msg).delay(1000).fadeOut(1000);
        } else {
          msg = 'You got ' + currName + '!';
          var sndO = new Audio("audio/ok2.mp3");
          sndO.play();
          setTimeout(function() {
            googleMarker.setMap(null);
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
        googleMarker.setMap(null);
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
        getLat: getLat,
        setLat: setLat,
        getLon: getLon,
        setLon: setLon,
        getName: getName,
        setName: setName,
        getSize: getSize,
        setSize: setSize,
        getZIndex: getZIndex,
        setZIndex: setZIndex,
        getType: getType,
        setType: setType,
        getGoogleMarker: getGoogleMarker,
        getMarkerIcon: getMarkerIcon,
        getMarkerIconActive: getMarkerIconActive,
        showMarker: showMarker,
        makeInteractive: makeInteractive,
        hideMarker: hideMarker,
        setMarkerIcon: setMarkerIcon
    };

};

if (typeof window === 'undefined') {
    module.exports = APP.Marker;
}
