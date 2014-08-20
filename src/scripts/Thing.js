var APP = APP || {};

/**
 * Class representing an Thing.
 * @constructor
 * @param config A configuration object.
 */
APP.Thing = function (config, gameBounds) {
    'use strict';
        // properties
    var id,
        lat,
        lon,
        marker,
        limit,
        gameBounds,

        // methods
        getId,
        setId,
        getLat,
        getLon,
        getDistBetwPoints,
        deg2rad,
        lateId,
        showMarker;

    // initialize properties
    config = config || {};

    // location: 37.886, -122.064

    id = config.id || '';

    var coords = gameBounds.getRandCoords();

    if (config.lat) {
        lat = config.lat;
    } else {
        lat = coords.lat;
    }
    if (config.lon) {
        lon = config.lon;
    } else {
        lon = coords.lon;
    }

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
     * Get the longitude
     * @returns The longitude
     */
    getLon = function () {
        return lon;
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

    lateId = function() {
      setTimeout(function() {
        return getId();
      }, 1000);
    }

    /**
     * Show a Thing marker on a Google Map
     * @returns The longitude
     */
    showMarker = function (map) {
        var pos = new google.maps.LatLng(getLat(), getLon());
        marker = new google.maps.Marker({
          position: pos,
          anchor: new google.maps.Point(8, 8),
          map: map,
          title: getLat().toString()+', '+getLon(),
          icon: 'images/coin.png'
        });
        google.maps.event.addListener(marker, 'click', function(ev) {
          var player = APP.map.getPlayer();
          var dist = getDistBetwPoints(
            getLat(),
            getLon(),
            player.position.k,
            player.position.B
          );
          marker.setIcon('images/coin_flipped.png')
          var msg;
          if (dist * 1000 > limit) {
            msg = 'Thing not in range';
            var errorAudio = $("#errorAudio")[0];
            errorAudio.play();
            setTimeout(function() {
              marker.setIcon('images/coin.png')
            }, 500);
            $('#msg').show().html('Out of range').fadeOut(1000);
          } else {
            msg = 'Thing in range';
            var okAudio = $("#okAudio")[0];
            okAudio.play();
            setTimeout(function() {
              marker.setMap(null);
            }, 200);
            $('#msg').show().html('Coin collected').fadeOut(1000);
            APP.game.changeScore(1);
            APP.game.displayScore();
          }
          console.log(msg);
        });
    };

    // Public API
    return {
        getId: getId,
        setId: setId,
        getLat: getLat,
        getLon: getLon,
        getDistBetwPoints: getDistBetwPoints,
        showMarker: showMarker,
        limit: limit
    };

};
