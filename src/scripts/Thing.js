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
        lat,
        lon,
        marker,
        markerIcon,
        markerIconActive,
        markerIconSmall,
        markerIconTiny,
        limit,
        gameBounds,

        // methods
        getId,
        setId,
        getLat,
        setLat,
        getLon,
        setLon,
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
    lat = config.lat;
    lon = config.lon;

    markerIcon = 'images/coin.png';
    markerIconActive = 'images/coin_flipped.png';
    markerIconSmall = 'images/coin_small.png';
    markerIconTiny = 'images/coin_tiny.png';

    // Limit for interacting with Thing (in meters)
    limit = config.limit || 21;

    /**
     * Get the ID
     * @returns The ID
     */
    getId = function () {
        return id;
    };

    /**
     * Get the ID
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
    }

    deg2rad = function (deg) {
      return deg * (Math.PI/180)
    }

    getMarker = function () {
      if (marker) {
        return marker;
      } else {
        return null;
      }
    }

    getMarkerIcon = function () {
      return markerIcon;
    }

    getMarkerIconActive = function () {
      return markerIconActive;
    }

    /**
     * Show a Thing marker on a Google Map
     * @param map The APP.Map object
     * @param {boolean} interactive Add event handling (true or false)
     */
    showMarker = function (map, interactive) {
        var pos = new google.maps.LatLng(getLat(), getLon());
        marker = new google.maps.Marker({
          position: pos,
          anchor: new google.maps.Point(8, 8),
          map: map.getMap(),
          title: getLat().toString()+', '+getLon(),
          icon: getMarkerIcon()
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
        marker.setIcon(getMarkerIconActive())
        var msg;
        if (dist * 1000 > limit) {
          msg = 'Out of range';
          var sndE = new Audio("audio/error2.mp3");
          sndE.play();
          setTimeout(function() {
            marker.setIcon(getMarkerIcon())
          }, 500);
          $('#msg').show().html(msg).fadeOut(1000);
        } else {
          msg = 'Coin collected';
          var sndO = new Audio("audio/ok2.mp3");
          sndO.play();
          setTimeout(function() {
            marker.setMap(null);
          }, 200);
          $('#msg').show().html(msg).fadeOut(1000);
          APP.game.changeScore(1);
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
      if (size === 'small') {
        marker.setIcon(markerIconSmall);
      } else if (size === 'large') {
        marker.setIcon(markerIcon);
      } else if (size === 'tiny') {
        marker.setIcon(markerIconTiny);
      }
      if (size === 'small' || size === 'tiny') {
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
