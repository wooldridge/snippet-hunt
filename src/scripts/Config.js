var APP = APP || {};

/**
 * Class that returns a configuration object.
 * @constructor
 * @param config A configuration object.
 */
APP.Config = function (myLat, myLon) {
    'use strict';

    var config = {
      global: {
        host: '172.16.12.136',
        //host: '10.0.0.8',
        port: 9055,
        fileName: 'config.json',
        myLat: myLat || null,
        myLon: myLon || null,
        nextThingId: 1001,
        nextUserId: 1001
      },
      admin: {
        mapCanvasId: 'map-canvas-admin',
        numThings: 10,
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
        userId: 'username',
        playRadius: 20
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

    return config;

};
