var APP = APP || {};

/**
 * Class for game administration.
 * @constructor
 * @param config A configuration object.
 */
APP.Admin = function (config) {
  'use strict';
      // properties
  var config,
      boundsConfig,
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
      removeAllThings;

  // initialize
  config = config || {};

  things = [];
  allMarkers = [];

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
  }

  mapConfig = {
    id: config.mapCanvasId,
    style: config.mapStyle,
    myLat: config.myLat,
    myLon: config.myLon,
    mapOptions: config.mapOptions,
    rectOptions: config.rectOptions
  }

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
  }

  /**
   * Post things to db.
   * @param num Number of Things to add
   * @param gameBounds Game bounds
   */
  postThings = function (num, gameBounds) {
      thingMgr = APP.ThingMgr(config);
      coords = gameBounds.getRandCoords();
      thingMgr.createThing({lat: coords.lat, lon: coords.lon}, function (thing) {
        var id = thing.getId();
        num--;
        if (num > 0) {
          things.push(thing);
          postThings(num, gameBounds);
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
      // TBD
      $('#' + config.mapCanvasId).trigger('removeAllThingsDone');
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
      postThings($('#numThings').val(), gameBounds);
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
      APP.configMgr.saveConfig(configToSave, function () {

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
