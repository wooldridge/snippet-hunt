var APP = APP || {};

/**
 * Class for game administration.
 * @constructor
 * @param config A configuration object.
 */
APP.Admin = function (config) {
  'use strict';
      // properties
  var mlhost,
      mlport,
      numThings,
      myLat,
      myLon,
      lat1,
      lon1,
      lat2,
      lon2,
      map,
      mapOptions,
      mapBounds,
      rectangle,
      ne,
      sw,
      mapStyles,
      mapStyle,
      styleIds,
      mapTypes,
      styles,
      config,
      url,
      json,
      nextId,

      // methods
      displayForm,
      setConfig,
      getConfig,
      addThings;

  // initialize
  config = config || {};

  mlhost = config.mlhost || 'localhost';
  mlport = config.mlport || 9055;

  mapStyles = new APP.MapStyles();
  styleIds = mapStyles.getStyles();

  numThings = config.numThings || 10;
  myLat = config.myLat || 0;
  myLon = config.myLon || 0;
  lat1 = config.lat1 || 0;
  lon1 = config.lon1 || 0;
  lat2 = config.lat2 || 0;
  lon2 = config.lon2 || 0;
  mapStyle = config.mapStyle || styleIds[0];
  nextId = config.nextId || 1001;

  /**
   * Display admin form.
   */
  displayForm = function () {

    // Set form values
    $('#numThings').val(numThings);
    $('#lat1').val(lat1);
    $('#lon1').val(lon1);
    $('#lat2').val(lat2);
    $('#lon2').val(lon2);

    // Configure and draw map
    mapOptions = {
      center: new google.maps.LatLng(myLat, myLon),
      zoom: 18
    };

    map = new google.maps.Map(document.getElementById('map-canvas-admin'),
        mapOptions);

    // Configure and draw rectangle overlay
    mapBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(lat1, lon1),
      new google.maps.LatLng(lat2, lon2)
    );

    rectangle = new google.maps.Rectangle({
      strokeColor: '#666666',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#CCCCCC',
      fillOpacity: 0.25,
      bounds: mapBounds,
      editable: true,
      draggable: true
    });

    rectangle.setMap(map);

    // Populate styles menu and load map types
    mapTypes = {};
    $.each(styleIds, function (i, styleId) {
      $('#mapStyles').append($('<option>', {
          value: styleId,
          text: styleId
      }));
      mapTypes[styleId] = new google.maps.StyledMapType(
        mapStyles.getStyle(styleId),
        {
          map: map,
          name: styleId
        }
      );
      map.mapTypes.set(styleId, mapTypes[styleId]);
    });
    map.setMapTypeId(mapStyle);
    $('#mapStyles').val(mapStyle);

    // Handle styles menu change
    // @see http://stackoverflow.com/questions/3121400/google-maps-v3-how-to-change-the-map-style-based-on-zoom-level
    $('#mapStyles').change(function (ev) {
      var selStyleId = ev.target.selectedOptions[0].value;
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
   * Submit config data to db
   */
  setConfig = function () {
    var config = {
      lat1: $('#lat1').val(),   // south horiz
      lon1: $('#lon1').val(),   // west vert
      lat2: $('#lat2').val(),   // north horiz
      lon2: $('#lon2').val(),   // east vert
      style: $('#mapStyle').val(),
      numThings: $('#numThings').val()
    };
    url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=config.json';
    json = JSON.stringify(config);
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
          $('#adminForm button').html("Save Game");
        }, 800);
        // Then display form
        //displayForm();
    }).error(function (data) {
        console.log('Config post error: ' + data);
    });
  }

  /**
   * Get config info from db.
   */
  getConfig = function (callback) {
    url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=config.json';
    $.ajax({
        type: 'GET',
        url: url,
        data: json,
        headers: {
            'content-type': 'application/json'
        }
    }).done(function (data) {
        console.log('Config retrieved: ' + data);
        callback(data);
    }).error(function (data) {
        console.log('Error: ' + data);
    });
  }

  /**
   * Create one or more Things.
   * @param num Number of Things to add (optional)
   * @param bounds Game bounds
   */
  addThings = function (num, bounds) {
      var thing;
      config = { id: nextId };
      thing = new APP.Thing(config, bounds);
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
   * Handle form submit.
   */
  $('#adminForm button').click(function (ev) {
    console.log('submit clicked');
    setConfig();
    addThings(numThings, mapBounds);
    return false;
  });

  // Public API
  return {
      displayForm: displayForm
  };

};
