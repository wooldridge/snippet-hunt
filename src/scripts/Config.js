var APP = APP || {};

/**
 * Class representing configuration.
 * @constructor
 * @param config A configuration object.
 */
APP.Config = function (myLat, myLon) {
    'use strict';
        // properties
    var config,

        // methods
        get;

    // initialize properties
    config = {
      global: {
        host: 'localhost',
        port: 9055,
        myLat: myLat,
        myLon: myLon,
        mapStyles: new APP.MapStyles()
      },
      admin: {
        mapCanvasId: 'map-canvas-admin',
        numThings: 10,
        myLat: myLat,
        myLon: myLon,
        lat1: myLat - 0.0007,
        lon1: myLon - 0.001,
        lat2: myLat + 0.0007,
        lon2: myLon + 0.001,
        mapStyle: 'retro',
        mapStyleIndex: 0,
        nextId: 1001,
        fileName: 'config.json',
        mapOptions: {
          zoom: 18
        },
        rectOptions: {
          strokeColor: '#666666',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#CCCCCC',
          fillOpacity: 0.25
        }
      },
      game: {

      }
    };

    /**
     * Get a configuration
     * @param id The configuration ID
     * @returns The configuration object
     */
    get = function (id) {
      var result = {};
      $.extend(result, config[id], config['global']);
      return result;
    };

    // Public API
    return {
        get: get
    };

};
