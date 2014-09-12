var APP = APP || {};

/**
 * Class representing a Thing.
 * @constructor
 * @param config A Thing config object.
 */
APP.Thing = function (config) {
    'use strict';
        // properties
    var id,
        type,
        name,
        lat,
        lon,
        value,
        zIndex,
        marker,
        icon,
        markerIcon,
        markerIconActive,
        markerIconSmall,
        markerIconSmallActive,
        markerIconTiny,
        markerIconTinyActive,
        markerSize,
        limit,
        gameBounds,

        // methods
        getId,
        setId,
        getType,
        setType,
        getName,
        setName,
        getLat,
        setLat,
        getLon,
        setLon,
        getValue,
        setValue,
        getZIndex,
        setZIndex,
        getDistBetwPoints,
        deg2rad,
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

    id = config.id || '';
    type = config.type || '';
    name = config.name || '';
    lat = config.lat;
    lon = config.lon;
    value = config.value || 1;
    zIndex = config.zIndex || 1;

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
     * Get the value
     * @returns The value
     */
    getValue = function () {
        return value;
    };

    /**
     * Set the value
     * @param val The new value
     */
    setValue = function (newVal) {
        value = newVal;
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

    getMarker = function () {
      if (marker) {
        return marker;
      } else {
        return null;
      }
    };

    getMarkerIcon = function () {
      switch(markerSize) {
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
      switch(markerSize) {
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
        var pos = new google.maps.LatLng(getLat(), getLon());

        // var image = {
        //   url: getMarkerIcon(),
        //   size: new google.maps.Size(40, 40),
        //   origin: new google.maps.Point(0,0),
        //   anchor: new google.maps.Point(20, 20)
        // };

        marker = new google.maps.Marker({
          position: pos,
          map: map.getMap(),
          title: getName(),
          icon: getMarkerIcon(),
          zIndex: getZIndex()
        });
        if (interactive !== false) {
          makeInteractive(map, marker);
        }
    };

    /**
     * Add events to make marker interactive
     * @param map The APP.Map object
     * @param marker The marker object
     */
    makeInteractive = function (map, marker) {
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

    setMarkerIcon = function (size) {
      markerSize = size;
      if (markerSize === 'small') {
        marker.setIcon(markerIconSmall);
      } else if (markerSize === 'large') {
        marker.setIcon(markerIcon);
      } else if (markerSize === 'tiny') {
        marker.setIcon(markerIconTiny);
      }
      if (markerSize === 'tiny') {
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
        getValue: getValue,
        setValue: setValue,
        getZIndex: getZIndex,
        setZIndex: setZIndex,
        getDistBetwPoints: getDistBetwPoints,
        getMarker: getMarker,
        getMarkerIcon: getMarkerIcon,
        getMarkerIconActive: getMarkerIconActive,
        showMarker: showMarker,
        makeInteractive: makeInteractive,
        hideMarker: hideMarker,
        setMarkerIcon: setMarkerIcon,
        limit: limit,
        marker: marker
    };

};
