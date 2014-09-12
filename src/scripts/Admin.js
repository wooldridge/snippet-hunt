var APP = APP || {};

/**
 * Class for game administration.
 * @constructor
 * @param config A configuration object.
 */
APP.Admin = function (config) {
  'use strict';
      // properties
  var boundsConfig,
      bounds,
      mapConfig,
      map,
      defaultStyleId,
      mapStyleIds,
      selStyleId,
      gameBounds,
      coords,
      thingConfig,
      thingMgr,
      things,
      allMarkers,

      // methods
      displayAdmin,
      postThings,
      removeAllThings,
      removeAllConfigs;

  // initialize
  config = config || {};

  things = [];
  allMarkers = [];

  thingMgr = APP.ThingMgr(config);

 /**
  * boundsConfig describes the map space
  * @example home: 37.885454, -122.063447
  * @example work: 37.507278, -122.246814
  */
  boundsConfig = {
    lat1: config.lat1,
    lon1: config.lon1,
    lat2: config.lat2,
    lon2: config.lon2
  };

  mapConfig = {
    id: config.mapCanvasId,
    style: config.mapStyle,
    myLat: config.myLat,
    myLon: config.myLon,
    mapOptions: config.mapOptions,
    rectOptions: config.rectOptions
  };

  if (config.mapStyles) {
    mapConfig.mapStyles = config.mapStyles;
  }

  /**
   * Display admin view.
   */
  displayAdmin = function () {

    // Set form field values
    $('#numThings').val(config.numThings);
    $('#lat1').val(config.lat1);
    $('#lon1').val(config.lon1);
    $('#lat2').val(config.lat2);
    $('#lon2').val(config.lon2);

    bounds = new APP.Bounds(boundsConfig);
    map = new APP.Map(mapConfig, bounds);
    map.showMap();

    map.showRectangle(bounds);

    mapStyleIds = config.mapStyles.getStyles();
    defaultStyleId = mapStyleIds[config.mapStyleIndex];
    map.loadMapTypes(mapStyleIds);
    map.setMapType(defaultStyleId);

    // Populate styles menu
    $.each(mapStyleIds, function (i, s) {
      $('#mapStyles').append($('<option>', {
          value: s,
          text: s
      }));
    });
    // Initial style setting
    $('#mapStyles').val(defaultStyleId);

    // Handle styles menu change
    // @see http://stackoverflow.com/questions/3121400/google-maps-v3-how-to-change-the-map-style-based-on-zoom-level
    $('#mapStyles').change(function (ev) {
      console.log('map styles changed: ' + selStyleId);
      selStyleId = ev.target.selectedOptions[0].value;
      map.setMapType(selStyleId);
    });

    // Handle rectangle change
    // @see https://developers.google.com/maps/documentation/javascript/examples/rectangle-event
    $('#' + config.mapCanvasId).on('rectChanged', function (ev, lat1, lon1, lat2, lon2) {
      console.log('map rect changed');
      $('#lat1').val(lat1);
      $('#lon1').val(lon1);
      $('#lat2').val(lat2);
      $('#lon2').val(lon2);
    });
  };


  /**
   * Post things to db.
   * @param thingsTypes Things config object
   * @param numTypes Number of thing types to load
   * @param numItems Number of things for the first item type being loaded
   * @param gameBounds The game bounds
   */
  postThings = function (thingsTypes, numTypes, numItems, gameBounds) {
    coords = gameBounds.getRandCoords();
    thingMgr.createThing(
      { type: thingsTypes[numTypes-1].type,
        name: thingsTypes[numTypes-1].name,
        lat: coords.lat,
        lon: coords.lon,
        value: thingsTypes[numTypes-1].value,
        zIndex: thingsTypes[numTypes-1].zIndex },
      function (thing) {
        var id = thing.getId();
        numItems--;
        // Cycle through items until 0
        if (numItems > 0) {
          things.push(thing);
          postThings(thingsTypes, numTypes, numItems, gameBounds);
        // If items 0, cycle through next item type
        } else if (--numTypes > 0) {
          postThings(thingsTypes, numTypes, thingsTypes[numTypes-1].defaultNum, gameBounds);
        // If items and type 0, done
        } else {
          console.log('Triggering postThingsDone');
          $('#' + config.mapCanvasId).trigger('postThingsDone');
        }
    });
  };

  /**
   * Clear all Things from the database.
   */
  removeAllThings = function () {
    thingMgr.deleteAllThings(function () {
      $('#' + config.mapCanvasId).trigger('removeAllThingsDone');
    });
  };

  /**
   * Clear all Configs from the database.
   */
  removeAllConfigs = function () {
    APP.configMgr.deleteAllSavedConfigs(function () {
      $('#' + config.mapCanvasId).trigger('removeAllConfigsDone');
    });
  };

  /**
   * Handle form submit.
   */
  $('#adminForm button').click(function (ev) {
    map.disableRectangle();
    $('#adminForm button').html("Saving...");
    var boundsConfig = {
      lat1: parseFloat($('#lat1').val()),
      lon1: parseFloat($('#lon1').val()),
      lat2: parseFloat($('#lat2').val()),
      lon2: parseFloat($('#lon2').val())
    };
    gameBounds = APP.Bounds(boundsConfig);
    $('#' + config.mapCanvasId).on('removeAllThingsDone', function () {
      removeAllConfigs();
    });
    $('#' + config.mapCanvasId).on('removeAllConfigsDone', function () {
      var thingsConfig = APP.configMgr.get('things');
      var thingsTypes = thingsConfig.types;
      postThings(thingsTypes, thingsTypes.length,
                 thingsTypes[thingsTypes.length-1].defaultNum, gameBounds);
    });
    $('#' + config.mapCanvasId).on('postThingsDone', function () {
      for (var i = 0; i < things.length; i++) {
        things[i].showMarker(map, false);
      }
      var configToSave = {
        lat1: $('#lat1').val(),   // south horiz
        lon1: $('#lon1').val(),   // west vert
        lat2: $('#lat2').val(),   // north horiz
        lon2: $('#lon2').val(),   // east vert
        mapStyle: $('#mapStyles').val(),
        numThings: $('#numThings').val()
      };
      APP.configMgr.saveConfig(configToSave, function (id) {
        localStorage.setItem('gameId', id);
      });
    });
    removeAllThings();

    setTimeout(function () {
      $('#adminForm button').html("Game Saved");
      $('#adminForm button').prop('disabled', true);
      $('#gameLink').show();
    }, 800);
    return false;
  });

  // Public API
  return {
      displayAdmin: displayAdmin
  };

};
