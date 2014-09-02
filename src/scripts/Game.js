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
        bounds,
        mapConfig,
        map,
        thing,
        things,
        thingMgr,
        user,
        userId,
        userMgr,

        // methods
        displayScore,
        changeScore,
        displayUser,
        loadUser,
        displayGame;

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
    bounds = new APP.Bounds(boundsConfig);

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
    map = new APP.Map(mapConfig, bounds);

    things = [];

    userMgr = new APP.UserMgr(APP.configMgr.get('user'));
    thingMgr = new APP.ThingMgr(APP.configMgr.get('user'));

    /**
     * Display the username in the UI.
     */
    displayUser = function () {
        $('#' + config.userId).html(user.getUsername());
    };

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
     * Load user data. Display user form if needed.
     */
    loadUser = function () {
        // Handle submission of user form
        $('#usernameForm button').click(function () {
            var userConfig = {
              username: $('#usernameInput').val(),
            }
            user = new APP.User(userConfig);
            userMgr.createUser(user.toJSON(), function (id) {
                $('#usernameModal').modal('hide');
                localStorage.setItem('userId', id);
                displayGame();
            });
            return false;
        });
        // Get user data from localStorage and database
        userId = localStorage.getItem('userId');
        if(!userId) {
            $('#usernameModal').modal({});
        } else {
            userMgr.getUser(userId, function (data) {
                if (data.statusText && data.statusText === 'Not Found') {
                    $('#usernameModal').modal({});
                } else {
                    user = new APP.User(data);
                    displayGame();
                }
            });
        }
    };

    /**
     * Initialize the game.
     */
    displayGame = function () {
        displayScore();
        displayUser();
        map.showMap();
        map.showPlayer();
        thingMgr.getAllThings(function (results) {
            things = results;
            map.showMarkers(things);
        });

        $('#map-canvas').on('deleteThing', function (ev, id) {
            thingMgr.deleteThing(id, function () {
                for (var i = 0; i < things.length; i++) {
                  if (things[i].getId() === id) {
                    things.splice(i, 1);
                    break;
                  }
                }
                socket.emit('thingDeleted', { 'id': id });
            });
        });

        socket.on('thingDeleted', function (data) {
            console.log('thingDeleted received, cycling through things');
            for (var i = 0; i < things.length; i++) {
              if (things[i].getId() === data.id) {
                console.log('thing to hide found, calling things[i].hideMarker()');
                things[i].hideMarker();
                var snd = new Audio("audio/error.mp3");
                snd.play();
                break;
              }
            }
        });

        $('#' + config.mapCanvasId).on('scoreChanged', function () {
            userMgr.updateUser(localStorage.getItem('userId'), user.toJSON());
        });

    };

    // Public API
    return {
        displayScore: displayScore,
        changeScore: changeScore,
        loadUser: loadUser,
        displayGame: displayGame
    };

};
