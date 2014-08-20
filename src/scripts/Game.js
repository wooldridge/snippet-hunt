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
        nextId,
        mlhost,
        mlport,
        mluser,
        mlpass,
        numThings,
        searchResults,
        bounds,
        map,
        score,

        // methods
        saveToDb,
        getById,
        getAll,
        addThings,
        getThings,
        displayScore,
        changeScore,
        initialize;

    // initialize properties
    /**
     * Get the value of a URL parameter.
     * @param name Name of the parameter.
     * @param defaultVal Default value to return if no parameter found.
     * @returns The parameter value (or the default value).
     */
    getParameterByName = function (name, defaultVal) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results === null) {
            return defaultVal ? defaultVal : '';
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    };

   /**
    * boundsConfig describes the playing space
    * @example home: 37.885454, -122.063447
    * @example work: 37.507278, -122.246814
    */
    boundsConfig = {
      lat1: parseFloat(getParameterByName('lat1', 37.506)),   // south horiz
      lon1: parseFloat(getParameterByName('lon1', -122.248)), // west vert
      lat2: parseFloat(getParameterByName('lat2', 37.508)),   // north horiz
      lon2: parseFloat(getParameterByName('lon2', -122.246))  // east vert
    }

    mapConfig = {
      id: 'map-canvas', // HTML container for map, no preceding '#'
      style: getParameterByName('mapStyle', 'subtleGrayscale')
    }

    things = [];

    nextId = config.nextId || 1001; // IDs for Thing objects

   /**
    * MarkLogic config
    */
    //mlhost = config.mlhost || '10.0.0.8';
    mlhost = config.mlhost || 'localhost';
    mlport = config.mlport || 9055;
    // NOTE: ML REST authentication turned off (application-level)
    // with default role of 'admin'
    //mluser = config.mluser || 'admin';
    //mlpass = config.mlpass || 'admin';

    numThings = parseInt(getParameterByName('numThings', 10));

    score = config.score || 0;


    /**
     * Save a Thing to the database.
     * @param json A JSON representation of the Thing
     */
    saveToDb = function (thing) {
        var url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=' + thing.getId();
        var json = {
            id: thing.getId(),
            lat: thing.getLat(),
            lon: thing.getLon()
        };
        json = JSON.stringify(json);
        $.ajax({
            type: 'PUT',
            url: url,
            data: json,
            headers: {
                'content-type': 'application/json'
            }
        }).done(function (data) {
            console.log('Thing posted: ' + json);
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Get a Thing from the database.
     * @param id The ID of the thing.
     */
    getById = function (id) {
        var url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=' + id;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            headers: {
                'content-type': 'application/json'
            }
        }).done(function (data) {
            console.log('Thing retrieved: ' + JSON.stringify(data));
            $('#' + mapConfig.id).trigger('getByIdDone');
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Get all Things from the database.
     */
    getAll = function () {
        // http://localhost:8077/v1/search?format=json&options=argame&pageLength=2
        var url = 'http://' + mlhost + ':' + mlport + '/v1/search';
            url += '?format=json&options=argame&pageLength=' + numThings;
        console.log('getAll url: ' + url);
        $.ajax({
            type: 'GET',
            url: url
        }).done(function (data) {
            console.log('Results retrieved: ' + JSON.stringify(data));
            searchResults = data;
            $('#' + mapConfig.id).trigger('getAllDone');
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Create one or more Things.
     * @todo Move this to a separate admin step.
     * @param num Number of Things to add (optional)
     */
    addThings = function (num, bounds) {
        var thing;
        config = { id: nextId };
        thing = new APP.Thing(config, bounds);
        things.push(thing);
        nextId++;
        var url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=' + thing.getId();
        var json = {
            id: thing.getId(),
            lat: thing.getLat(),
            lon: thing.getLon()
        };
        json = JSON.stringify(json);
        $.ajax({
            type: 'PUT',
            url: url,
            data: json,
            // IMPORTANT: Do not set 'dataType: "json"' since REST server
            // returns an empty body on success, which is invalid JSON
            headers: {
                'content-type': 'application/json'
            }
        }).done(function (data) {
            console.log('Thing posted: ' + json);
            if (num === 0) {
                console.log('Triggering addThingsDone');
                $('#' + mapConfig.id).trigger('addThingsDone');
            } else {
                num--;
                addThings(num, bounds);
            }
        }).error(function (data) {
            console.log(data);
        });
    };

    /**
     * Get the Things in the game.
     * @returns An array of Things.
     */
    getThings = function () {
        /* for (var i = 0; i < things.length; i++) {
            console.log('Thing lat: ' + things[i].getLat() + ' lon: ' + things[i].getLon());
        } */
        for (var i = 0; i < things.length; i++) {
            getById(things[i].getId());
        }
        return things;
    };

    /**
     * Display the score in the UI.
     */
    displayScore = function () {
        $('#score').html(score.toString());
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
            addThings(numThings, APP.bounds);
        });
        $('#' + mapConfig.id).on('addThingsDone', function () {
            APP.map.showMarkers(things);
        });
        APP.bounds = new APP.Bounds(boundsConfig);
        APP.map = new APP.Map(mapConfig, APP.bounds);
        APP.map.showMap();
        displayScore();
    };

    // Public API
    return {
        addThings: addThings,
        getThings: getThings,
        getAll: getAll,
        initialize: initialize,
        displayScore: displayScore,
        changeScore: changeScore,
        searchResults: searchResults,
        numThings: numThings,
        mapConfig: mapConfig
    };

};
