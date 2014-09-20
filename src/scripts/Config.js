var APP = APP || {};

var module = {};

/**
 * Class that returns a configuration object.
 * @constructor
 * @param config A configuration object.
 */
APP.Config = function (myLat, myLon) {
    'use strict';

    var config = {
      global: {
        host: '10.0.0.8',
        //host: 'localhost',
        //host: '172.16.12.136',
        port: 8066,
        fileName: 'config.json',
        myLat: myLat || null,
        myLon: myLon || null
      },
      admin: {
        mapCanvasId: 'map-canvas-admin',
        lat1: myLat - 0.0007,
        lon1: myLon - 0.001,
        lat2: myLat + 0.0007,
        lon2: myLon + 0.001,
        mapStyleIndex: 0,
        mapOptions: {
          zoom: 18,
          panControl: false,
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          mapTypeControl: true,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false
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
      },
      things: {
        types: [
          {type: 'snippet', name: 'Snippet', value: 10, lifespan: 120, defaultNum: 100, zIndex: 1},
          {type: 'gary', name: 'Gary', value: 100, lifespan: 600, defaultNum: 1, zIndex: 10},
          {type: 'chris', name: 'Chris', value: 100, lifespan: 600, defaultNum: 1, zIndex: 10},
          {type: 'david', name: 'David', value: 100, lifespan: 600, defaultNum: 1, zIndex: 10}
        ]
      }
    };

    if (APP.MapStyles) {
      config.global.mapStyles = new APP.MapStyles();
    }

    return config;

};

module.exports = APP.Config;
