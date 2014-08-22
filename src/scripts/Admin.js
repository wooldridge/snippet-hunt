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
      mapOptions,
      mapStyles,
      defaultStyleId,
      mapStyleIds,
      selStyleId,
      mapTypes,
      gameBounds,
      url,
      json,
      nextId,
      thing,
      thingConfig,
      things,
      allMarkers,

      // methods
      display,
      putConfig,
      putThings,
      clearThings;

  // initialize
  config = config || {};

  nextId = config.nextId || 1001;
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
    mapStyles: config.mapStyles,
    myLat: config.myLat,
    myLon: config.myLon,
    mapOptions: config.mapOptions,
    rectOptions: config.rectOptions
  }

  /**
   * Display admin view.
   */
  display = function () {

    // Set form field values
    $('#numThings').val(config.numThings);
    $('#lat1').val(config.lat1);
    $('#lon1').val(config.lon1);
    $('#lat2').val(config.lat2);
    $('#lon2').val(config.lon2);

    bounds = new APP.Bounds(boundsConfig);
    map = new APP.Map(mapConfig, bounds);
    map.showMap();

    map.showRectangle();

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
   * Put config data to db
   */
  putConfig = function () {
    var configToSave = {
      lat1: $('#lat1').val(),   // south horiz
      lon1: $('#lon1').val(),   // west vert
      lat2: $('#lat2').val(),   // north horiz
      lon2: $('#lon2').val(),   // east vert
      mapStyle: $('#mapStyles').val(),
      numThings: $('#numThings').val()
    };
    url = 'http://' + config.host + ':' + config.port + '/v1/documents?uri=' + config.fileName;
    url += '&collection=config'
    json = JSON.stringify(configToSave);
    $.ajax({
        type: 'PUT',
        url: url,
        data: json,
        headers: {
            'content-type': 'application/json'
        }
    }).done(function (data) {
        console.log('Config posted: ' + json);
    }).error(function (data) {
        console.log('Config put error: ' + data);
    });
  }

  /**
   * Put things to db.
   * @param num Number of Things to add
   * @param gameBounds Game bounds
   */
  putThings = function (num, gameBounds) {
      thingConfig = { id: nextId };
      thing = new APP.Thing(thingConfig, gameBounds);
      things.push(thing);
      nextId++;
      var url = 'http://' + config.host + ':' + config.port;
          url += '/v1/documents?uri=' + thing.getId();
          url += '&collection=thing';
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
          num--;
          if (num === 0) {
              console.log('Triggering putThingsDone');
              $('#' + config.mapCanvasId).trigger('putThingsDone');
          } else {
              putThings(num, gameBounds);
          }
      }).error(function (data) {
          console.log(data);
      });
  };

  clearThings = function () {
    for (var i = 0; i < things.length; i++) {
      var m = things[i].getMarker();
      m.setMap(null);
      things[i].marker = null;
    }
    things = [];
  }

  /**
   * Handle form submit.
   */
  $('#adminForm button').click(function (ev) {
    console.log('submit clicked');
    putConfig();
    map.disableRectangle();
    $('#adminForm button').html("Saving...");
    var boundsConfig = {
      lat1: parseFloat($('#lat1').val()),
      lon1: parseFloat($('#lon1').val()),
      lat2: parseFloat($('#lat2').val()),
      lon2: parseFloat($('#lon2').val())
    };
    gameBounds = APP.Bounds(boundsConfig);
    clearThings();
    putThings($('#numThings').val(), gameBounds);
    $('#' + config.mapCanvasId).on('putThingsDone', function () {
      for (var i = 0; i < things.length; i++) {
        things[i].showMarker(map, false);
      }
    });
    setTimeout(function () {
      $('#adminForm button').html("Game Saved");
      $('#adminForm button').prop('disabled', true);
      $('#gameLink').show();
    }, 800);
    return false;
  });

  // Public API
  return {
      display: display
  };

};
