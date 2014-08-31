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
        myLat,
        myLon,

        // methods
        get,
        getSavedConfig,
        getHost,
        getPort;

    // initialize
    myLat = myLat || 0;
    myLon = myLon || 0;

    // initialize properties
    config = {
      global: {
        //host: '172.16.12.136',
        host: '10.0.0.8',
        port: 9055,
        fileName: 'config.json',
        myLat: myLat,
        myLon: myLon,
        nextThingId: 1001,
        nextUserId: 1001
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
        scoreId: 'score',
        userId: 'username'
        // mapConfig: {
        //   //style: config.mapStyle,
        //   myLat: myLat,
        //   myLon: myLon
        // }
      },
      user: {
        score: 0
      }
    };

    if (APP.MapStyles) {
      config.global.mapStyles = new APP.MapStyles();
    }

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

    getHost = function () {
      return config.global.host;
    }

    getPort = function () {
      return config.global.port;
    }

    // Public API
    return {
      get: get,
      getSavedConfig: getSavedConfig,
      getHost: getHost,
      getPort: getPort
    };

};
