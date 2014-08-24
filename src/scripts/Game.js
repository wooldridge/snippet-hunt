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
        things,
        score,

        // methods
        getById,
        getAllThings,
        removeThing,
        displayScore,
        changeScore,
        initialize;

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
     * @param id The ID of the thing.
     */
    removeThing = function (id) {
        var url = 'http://' + config.host + ':' + config.port + '/v1/documents?uri=' + id;
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
            url += '&collection=thing&pageLength=' + config.numThings;
        console.log('getAll url: ' + url);
        $.ajax({
            type: 'GET',
            url: url
        }).done(function (data) {
            console.log('Results retrieved: ' + JSON.stringify(data));
            for (var i = 0; i < data.results.length; i++) {
                var thingConfig = {
                    id: data.results[i].metadata[0].id,
                    lat: data.results[i].metadata[1].lat,
                    lon: data.results[i].metadata[2].lon
                };
                var t = new APP.Thing(thingConfig);
                things.push(t);
            }
            $('#' + config.mapCanvasId).trigger('getAllThingsDone');
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Display the score in the UI.
     */
    displayScore = function () {
        $('#' + config.scoreId).html(score.toString());
    };

    /**
     * Change the score.
     */
    changeScore = function (n) {
        score += n;
    };

    /**
     * Initialize the game.
     */
    initialize = function () {
        $('#' + config.mapCanvasId).on('showMapDone', function () {
            map.showPlayer();
        });
        $('#' + config.mapCanvasId).on('showPlayerDone', function () {
            getAllThings();
        });
        $('#' + config.mapCanvasId).on('getAllThingsDone', function () {
            map.showMarkers(things);
        });
        bounds = new APP.Bounds(boundsConfig);
        map = new APP.Map(mapConfig, bounds);
        map.showMap();
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
    };

    // Public API
    return {
        getAllThings: getAllThings,
        removeThing: removeThing,
        initialize: initialize,
        displayScore: displayScore,
        changeScore: changeScore
    };

};
