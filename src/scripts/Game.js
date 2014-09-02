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
        score,
        user,
        userMgr,

        // methods
        getById,
        getAllThings,
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

    score = config.score || 0;

    userMgr = new APP.UserMgr(APP.configMgr.get('user'));

    /**
     * Get a Thing from the database.
     * @param id The ID of the thing.
     */
    getById = function (id) {
        var url = 'http://' + config.host + ':' + config.port + '/v1/documents?uri=' + id;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            headers: {
                'content-type': 'application/json'
            }
        }).done(function (data) {
            console.log('Thing retrieved: ' + JSON.stringify(data));
            $('#' + config.mapCanvasId).trigger('getByIdDone');
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Remove a Thing from the database.
     * @param id The ID of the Thing.
     */
    removeThing = function (id) {
        var url = 'http://' + config.host + ':' + config.port;
            url += '/v1/documents?uri=/things/' + id + '.json';
        $.ajax({
            type: 'DELETE',
            url: url
        }).done(function (data) {
            console.log('Thing deleted: ' + id);
            $('#' + config.mapCanvasId).trigger('removeThingDone');
            socket.emit('thingRemoved', { 'id': id });
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Get all Things from the database.
     */
    getAllThings = function () {
        // http://localhost:8077/v1/search?format=json&options=argame&pageLength=2
        var url = 'http://' + config.host + ':' + config.port + '/v1/search';
            url += '?format=json&options=argame';
            url += '&directory=/things/&pageLength=' + config.numThings;
        console.log('getAllThings url: ' + url);
        $.ajax({
            type: 'GET',
            url: url
        }).done(function (data) {
            console.log('Results retrieved: ' + data['page-length']);
            for (var i = 0; i < data.results.length; i++) {
                var thingConfig = {
                    // uri: /things/10499283988025584566.json
                    id: data.results[i].uri.slice(0, data.results[i].uri.length - 5).substring(8),
                    lat: data.results[i].metadata[0].lat,
                    lon: data.results[i].metadata[1].lon
                };
                thing = new APP.Thing(thingConfig);
                things.push(thing);
            }
            $('#' + config.mapCanvasId).trigger('getAllThingsDone');
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Get a User from the database.
     * @param id The ID of the User.
     */
    getUser = function (id) {
        var url = 'http://' + config.host + ':' + config.port;
            url += '/v1/documents?uri=/users/' + id + '.json';
        console.log('getUser url: ' + url);
        $.ajax({
            type: 'GET',
            url: url
        }).done(function (data) {
            console.log('User retrieved: ' + JSON.stringify(data));
            localStorage.setItem('userId', id);
            var userConfig = {
                id: id,
                username: data.username,
                score: data.score
            }
            user = new APP.User(userConfig);
            $('#' + config.mapCanvasId).trigger('getUserDone');
        }).error(function (data) {
            console.log(data);
            $('#' + config.mapCanvasId).trigger('getUserError');
        });
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
            getAllThings();
        });
        $('#' + config.mapCanvasId).on('getAllThingsDone', function () {
            map.showMarkers(things);
        });

        if(!localStorage.getItem('userId')) {
        //if(true) {
            $('#usernameModal').modal({});
        } else {
            getUser(localStorage.getItem('userId'));
        }

        socket.on('thingRemoved', function (data) {
            console.log('thingsRemoved received, cycling through things');
            for (var i = 0; i < things.length; i++) {
              if (things[i].getId() === data.id) {
                console.log('thing to hide found, calling things[i].hideMarker()');
                things[i].hideMarker();
                break;
              }
            }
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

          $('#map-canvas').on('scoreChanged', function () {

          });
    };

    // Public API
    return {
        getAllThings: getAllThings,
        removeThing: removeThing,
        display: display,
        displayScore: displayScore,
        changeScore: changeScore,
        getUser: getUser
    };

};
