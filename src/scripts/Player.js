var APP = APP || {};

/**
 * Class representing an located player.
 * @constructor
 * @param config A configuration object.
 */
APP.Player = function (config) {
    'use strict';
        // properties
    var id,
        lat,
        lon,

        // methods
        getId,
        getLat,
        getLon;

    // initialize properties
    config = config || {};

    id = config.id || '';

    /**
     * Get the ID
     * @returns The ID
     */
    getId = function () {
        return id;
    };

    /**
     * Get the latitude
     * @returns The latitude
     */
    getLat = function (callback) {
        navigator.geolocation.getCurrentPosition(callback);
    };

    /**
     * Get the longitude
     * @returns The longitude
     */
    getLon = function (callback) {
        navigator.geolocation.getCurrentPosition(callback);
    };

    // Public API
    return {
        getId: getId,
        getLat: getLat,
        getLon: getLon
    };

};
