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
        url,

        // methods
        get,
        getSavedConfig;

    // initialize properties
    config = {
      global: {
        host: '10.0.0.8',
        port: 9055,
        fileName: 'config.json',
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
        mapStyleIndex: 0,
        nextId: 1001,
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
        mapCanvasId: 'map-canvas',
        scoreId: 'score'
        // mapConfig: {
        //   //style: config.mapStyle,
        //   myLat: myLat,
        //   myLon: myLon
        // }
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

    /**
     * Get saved config info from db.
     */
    getSavedConfig = function (callback) {
      url = 'http://' + config.global.host + ':' + config.global.port;
      url += '/v1/documents?uri=' + config.global.fileName;
      $.ajax({
          type: 'GET',
          url: url,
          headers: {
              'content-type': 'application/json'
          }
      }).done(function (json) {
          console.log('Config retrieved: ' + json);
          if (callback) {
            callback(json);
          }
      }).error(function (data) {
          console.log('Error: ' + json);
      });
    }

    // Public API
    return {
      get: get,
      getSavedConfig: getSavedConfig
    };

};
