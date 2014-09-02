var APP = APP || {};

/**
 * Class representing a game.
 * @constructor
 * @param config A configuration object.
 * @param socket A web socket.
 */
APP.Game = function (config, socket) {
    'use strict';
        // properties
    var boundsConfig,
        mapConfig,
        bounds,
        map,
        thing,
        things,
        user,
        userMgr,
        thingMgr,

        // methods
        removeThing,
        displayScore,
        changeScore,
        displayUser,
        getUser,
        display;

   /**
    * boundsConfig describes the playing space
    * @example home: 37.885454, -122.063447
    * @example work: 37.507278, -122.246814
    */
    boundsConfig = {
      lat1: config.lat1,
      lon1: config.lon1,
      lat2: config.lat2,
      lon2: config.lon2
    }

    mapConfig = {
      id: config.mapCanvasId,
      style: config.mapStyle,
      mapStyles: config.mapStyles,
      myLat: config.myLat,
      myLon: config.myLon,
      mapOptions: {
        zoom: 18,
        maxZoom: 20,
        minZoom: 5,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false
      }
    }

    things = [];

    userMgr = new APP.UserMgr(APP.configMgr.get('user'));
    thingMgr = new APP.ThingMgr(APP.configMgr.get('user'));

    /**
     * Display the score in the UI.
     */
    displayScore = function () {
        $('#' + config.scoreId).html(user.getScore());
    };

    /**
     * Change the score.
     */
    changeScore = function (n) {
        user.changeScore(n, displayScore);
    };

    /**
     * Display the username in the UI.
     */
    displayUser = function () {
        $('#' + config.userId).html(user.getUsername());
    };

    /**
     * Initialize the game.
     */
    display = function () {
        $('#' + config.mapCanvasId).on('getUserError', function () {
            $('#usernameModal').modal({});
        });
        $('#' + config.mapCanvasId).on('getUserDone', function () {
            displayScore();
            displayUser();
            bounds = new APP.Bounds(boundsConfig);
            map = new APP.Map(mapConfig, bounds);
            map.showMap();
        });
        $('#' + config.mapCanvasId).on('showMapDone', function () {
            map.showPlayer();
        });
        $('#' + config.mapCanvasId).on('showPlayerDone', function () {
            thingMgr.getAllThings(function (results) {
                things = results;
                map.showMarkers(things);
            });
        });
        // $('#' + config.mapCanvasId).on('getAllThingsDone', function () {
        //     map.showMarkers(things);
        // });

        if(!localStorage.getItem('userId')) {
        //if(true) {
            $('#usernameModal').modal({});
        } else {
            userMgr.getUser(localStorage.getItem('userId'), function (data) {
                if (data.statusText && data.statusText === 'Not Found') {
                    $('#' + config.mapCanvasId).trigger('getUserError');
                } else {
                    user = new APP.User(data);
                    $('#' + config.mapCanvasId).trigger('getUserDone');
                }
            });
        }

        socket.on('thingDeleted', function (data) {
            console.log('thingDeleted received, cycling through things');
            for (var i = 0; i < things.length; i++) {
              if (things[i].getId() === data.id) {
                console.log('thing to hide found, calling things[i].hideMarker()');
                things[i].hideMarker();
                break;
              }
            }
        });

        $('#map-canvas').on('deleteThing', function (ev, id) {
            thingMgr.deleteThing(id, function () {
                socket.emit('thingDeleted', { 'id': id });
            });
        });

        $('#' + config.mapCanvasId).on('scoreChanged', function () {
            userMgr.updateUser(localStorage.getItem('userId'), user.toJSON());
        });

        $('#usernameForm button').click(function () {
            var userConfig = {
              username: $('#usernameInput').val(),
            }
            user = new APP.User(userConfig);
            userMgr.createUser(user.toJSON(), function (id) {
                $('#usernameModal').modal('hide');
                localStorage.setItem('userId', id);
                $('#' + config.mapCanvasId).trigger('getUserDone');
            });
            return false;
        });

    };

    // Public API
    return {
        removeThing: removeThing,
        display: display,
        displayScore: displayScore,
        changeScore: changeScore,
        getUser: getUser
    };

};
