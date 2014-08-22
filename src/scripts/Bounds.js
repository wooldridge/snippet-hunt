var APP = APP || {};

/**
 * Class representing the game bounds.
 * @constructor
 * @param config A configuration object.
 */
APP.Bounds = function (config) {
  'use strict';
      // properties
  var lat1, // south horiz
      lon1, // west vert
      lat2, // north horiz
      lon2, // east vert

      // methods
      getLat1,
      getLon1,
      getLat2,
      getLon2,
      getLatSpan,
      getLonSpan,
      getRandCoords,
      getCenterLat,
      getCenterLon;

  // initialize properties
  config = config || {};

  // Latitude and longitude values for the bounds in degrees.
  lat1 = config.lat1 || 0;
  lon1 = config.lon1 || 0;
  lat2 = config.lat2 || 0;
  lon2 = config.lon2 || 0;

 /**
  * Get lat1.
  */
  getLat1 = function () {
    return lat1;
  };

 /**
  * Get lon1.
  */
  getLon1 = function () {
    return lon1;
  };

 /**
  * Get lat2.
  */
  getLat2 = function () {
    return lat2;
  };

 /**
  * Get lon2.
  */
  getLon2 = function () {
    return lon2;
  };

 /**
  * Get the length of the latitude span in degrees.
  */
  getLatSpan = function () {
    return lat2 - lat1;
  };

 /**
  * Get the length of the longitude span in degrees.
  */
  getLonSpan = function () {
    return lon2 - lon1;
  };

 /**
  * Get a random lat/lon coordinate from inside the bounds.
  */
  getRandCoords = function () {
    return {
      lat: lat1 + getLatSpan() * Math.random(),
      lon: lon1 + getLonSpan() * Math.random()
    };
  };

 /**
  * Get center latitude value of bounds.
  */
  getCenterLat = function () {
    return lat1 + getLatSpan() / 2;
  };

 /**
  * Get center longitude value of bounds.
  */
  getCenterLon = function () {
    return lon1 + getLonSpan() / 2;
  };

  // Public API
  return {
    getLat1: getLat1,
    getLon1: getLon1,
    getLat2: getLat2,
    getLon2: getLon2,
    getRandCoords: getRandCoords,
    getCenterLat: getCenterLat,
    getCenterLon: getCenterLon
  };

};
