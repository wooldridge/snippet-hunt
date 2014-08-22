var APP = APP || {};

/**
 * Class representing a game.
 * @constructor
 * @param config A configuration object.
 */
APP.Game = function (config) {
    'use strict';
        // properties
    var getParameterByName,
        boundsConfig,
        mapConfig,
        things,
        mapOptions,
        numThings,
        searchResults,
        bounds,
        map,
        score,

        // methods
        getById,
        getAllThings,
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
      id: 'map-canvas', // HTML container for map, no preceding '#'
      style: config.mapStyle,
      myLat: config.myLat,
      myLon: config.myLon
    }

    things = [];

   /**
    * MarkLogic config
    */
    // mlhost = config.mlhost || 'localhost';
    // mlport = config.mlport || 9055;
    // NOTE: ML REST authentication turned off (application-level)
    // with default role of 'admin'
    //mluser = config.mluser || 'admin';
    //mlpass = config.mlpass || 'admin';

    numThings = config.numThings;

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
        $('#' + mapConfig.id).on('showMapDone', function () {
            APP.map.showPlayer();
        });
        $('#' + mapConfig.id).on('showPlayerDone', function () {
            getAllThings();
        });
        $('#' + mapConfig.id).on('getAllThingsDone', function () {
            APP.map.showMarkers(things);
        });
        APP.bounds = new APP.Bounds(boundsConfig);
        APP.map = new APP.Map(mapConfig, APP.bounds);
        APP.map.showMap();
        // mapOptions = {
        //   center: new google.maps.LatLng(myLat, myLon),
        //   zoom: 18
        // };
        // map = new google.maps.Map(document.getElementById('map-canvas'),
        //   mapOptions);
        //   displayScore();
    };

    // Public API
    return {
        getAllThings: getAllThings,
        initialize: initialize,
        displayScore: displayScore,
        changeScore: changeScore,
        searchResults: searchResults,
        numThings: numThings,
        mapConfig: mapConfig
    };

};
