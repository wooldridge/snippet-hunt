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
      mlhost,
      mlport,
      fileName,
      numThings,
      myLat,
      myLon,
      lat1,
      lon1,
      lat2,
      lon2,
      map,
      mapCanvasId,
      mapZoom,
      mapOptions,
      mapStyles,
      mapStyle,
      mapStyleIds,
      selStyleId,
      mapTypes,
      styles,
      rectBounds,
      gameBounds,
      rectangle,
      ne,
      sw,
      url,
      json,
      nextId,
      thing,
      things,
      allMarkers,

      // methods
      display,
      putConfig,
      getConfig,
      putThings,
      clearThings;

  // initialize
  config = config || {};

  mlhost = config.mlhost || 'localhost';
  mlport = config.mlport || 9055;
  fileName = config.fileName || 'config.json';

  numThings = config.numThings || 10;
  myLat = config.myLat || 0;
  myLon = config.myLon || 0;
  lat1 = config.lat1 || 0;
  lon1 = config.lon1 || 0;
  lat2 = config.lat2 || 0;
  lon2 = config.lon2 || 0;

  mapCanvasId = config.mapCanvasId || 'map-canvas-admin';
  mapZoom = config.mapZoom || 18;

  mapStyles = new APP.MapStyles();
  mapStyleIds = mapStyles.getStyles();
  mapStyle = config.mapStyleId || mapStyleIds[config.mapStyleIndex];

  nextId = config.nextId || 1001;
  things = [];
  allMarkers = [];

  /**
   * Display admin view.
   */
  display = function () {

    // Set form field values
    $('#numThings').val(numThings);
    $('#lat1').val(lat1);
    $('#lon1').val(lon1);
    $('#lat2').val(lat2);
    $('#lon2').val(lon2);

    // Configure and draw map
    mapOptions = {
      center: new google.maps.LatLng(myLat, myLon),
      zoom: mapZoom
    };

    map = new google.maps.Map(document.getElementById(mapCanvasId),
        mapOptions);

    // Configure and draw rectangle overlay
    rectBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(lat1, lon1),
      new google.maps.LatLng(lat2, lon2)
    );

    rectangle = new google.maps.Rectangle({
      strokeColor: '#666666',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#CCCCCC',
      fillOpacity: 0.25,
      bounds: rectBounds,
      editable: true,
      draggable: true
    });

    rectangle.setMap(map);

    // Populate styles menu and load map types
    mapTypes = {};
    $.each(mapStyleIds, function (i, s) {
      $('#mapStyles').append($('<option>', {
          value: s,
          text: s
      }));
      mapTypes[s] = new google.maps.StyledMapType(
        mapStyles.getStyle(s),
        {
          map: map,
          name: s
        }
      );
      map.mapTypes.set(s, mapTypes[s]);
    });
    map.setMapTypeId(mapStyle);
    $('#mapStyles').val(mapStyle);

    // Handle styles menu change
    // @see http://stackoverflow.com/questions/3121400/google-maps-v3-how-to-change-the-map-style-based-on-zoom-level
    $('#mapStyles').change(function (ev) {
      selStyleId = ev.target.selectedOptions[0].value;
      map.setMapTypeId(selStyleId);
      console.log('map styles changed: ' + selStyleId);
    });

    // Handle rectangle change
    // @see https://developers.google.com/maps/documentation/javascript/examples/rectangle-event
    google.maps.event.addListener(rectangle, 'bounds_changed', function (event) {
      var ne = rectangle.getBounds().getNorthEast();
      var sw = rectangle.getBounds().getSouthWest();
      $('#lat1').val(sw.lat());
      $('#lon1').val(ne.lng());
      $('#lat2').val(ne.lat());
      $('#lon2').val(sw.lng());
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
    url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=' + fileName;
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
        $('#adminForm button').html("Saving...");
        setTimeout(function () {
          $('#adminForm button').html("Game Saved");
          $('#adminForm button').prop('disabled', true);
          rectangle.setEditable(false);
        }, 800);
    }).error(function (data) {
        console.log('Config put error: ' + data);
    });
  }

  /**
   * Get config info from db.
   */
  getConfig = function (callback) {
    url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=' + fileName;
    $.ajax({
        type: 'GET',
        url: url,
        data: json,
        headers: {
            'content-type': 'application/json'
        }
    }).done(function (json) {
        console.log('Config retrieved: ' + json);
        if (callback) {
          callback(json);
        }
    }).error(function (data) {
        console.log('Error: ' + json);
    });
  }

  /**
   * Put things to db.
   * @param num Number of Things to add
   * @param gameBounds Game bounds
   */
  putThings = function (num, gameBounds) {
      config = { id: nextId };
      thing = new APP.Thing(config, gameBounds);
      things.push(thing);
      nextId++;
      var url = 'http://' + mlhost + ':' + mlport;
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
              $('#' + mapCanvasId).trigger('putThingsDone');
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
    ev.preventDefault();
    ev.stopPropagation();
    putConfig();
    var boundsConfig = {
      lat1: parseFloat($('#lat1').val()),
      lon1: parseFloat($('#lon1').val()),
      lat2: parseFloat($('#lat2').val()),
      lon2: parseFloat($('#lon2').val())
    };
    gameBounds = APP.Bounds(boundsConfig);
    clearThings();
    putThings($('#numThings').val(), gameBounds);
    $('#' + mapCanvasId).on('addThingsDone', function () {
      for (var i = 0; i < things.length; i++) {
        things[i].showMarker(map, false);
      }
    });

    return false;
  });

  // Public API
  return {
      display: display,
      getConfig: getConfig
  };

};
