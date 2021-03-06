var APP = APP || {};

/**
 * Class for managing Things.
 * @constructor
 * @param config A configuration object.
 */
APP.ThingMgr = function (config) {
  'use strict';
    // properties
  var things,
      thing,
      directory,
      collection,

    // methods
    createThing,
    getThing,
    getAllThings,
    updateThing,
    deleteThing,
    deleteAllThings;

  // initialize properties
  config = config || {};

  things = [];
  directory = 'things';
  collection = 'things';

  /**
   * Create a Thing.
   * @param {object} config A Thing config object
   * @param {function} callback A callback to run on success
   */
  createThing = function (configThing, callback) {
    thing = new APP.Thing(configThing);
    var url = 'http://' + config.host + ':' + config.port;
        url += '/v1/documents?extension=json&directory=/' + directory + '/';
        url += '&collection=' + collection;
    console.log('Thing.createThing url: ' + url);
    var json = {
      type: thing.getType(),
      name: thing.getName(),
      lat: thing.getLat(),
      lon: thing.getLon(),
      value: thing.getValue(),
      exp: thing.getExp(),
      zIndex: thing.getZIndex()
    };
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(json),
      headers: {
        'content-type': 'application/json'
      }
    }).done(function (data, textStatus, jqXHR) {
      console.log('Thing.createThing: ' + data.headers.location);
      // data.headers.location:
      // /v1/documents?uri=/things/4123628437005578381.json
      var id = data.headers.location
           .slice(0, data.headers.location.length - 5)
           .substring(26);
      thing.setId(id);
      if(callback) {
        callback(thing);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };

  /**
   * Get Thing by ID.
   * @param {string} id The Thing ID
   * @param {function} callback A callback to run on success
   */
  getThing = function (id, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('Thing.getThing url: ' + url);
    $.ajax({
      type: 'GET',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('Thing.getThing: ' + JSON.stringify(data));
      if (callback) {
        // data is q
        callback(data);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };

  /**
   * Get all Things.
   * @param {function} callback A callback to run on success
   */
  getAllThings = function (callback) {
    var url = 'http://' + config.host + ':' + config.port + '/v1/search';
        url += '?format=json&options=argame';
        url += '&directory=/things/&pageLength=999';
    console.log('ThingMgr.getAllThings url: ' + url);
    $.ajax({
      type: 'GET',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('Results retrieved: ' + data.results.length);
      for (var i = 0; i < data.results.length; i++) {
        var thingConfig = {
          // uri: /things/10499283988025584566.json
          id: data.results[i].uri
              .slice(0, data.results[i].uri.length - 5)
              .substring(8),
          type: data.results[i].metadata[0].type,
          name: data.results[i].metadata[1].name,
          lat: data.results[i].metadata[2].lat,
          lon: data.results[i].metadata[3].lon,
          value: data.results[i].metadata[4].value,
          exp: data.results[i].metadata[5].exp,
          zIndex: data.results[i].metadata[6].zIndex
        };
        thing = new APP.Thing(thingConfig);
        things.push(thing); // @todo side effect, remove from here
      }
      //$('#' + config.mapCanvasId).trigger('getAllThingsDone');
      $('#map-canvas').trigger('getAllThingsDone');
      if (callback) {
        callback(things);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };

  /**
   * Update a Thing.
   * @param {function} callback A callback to run on success
   */
  updateThing = function (id, thing, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('Thing.updateThing url: ' + url);
    $.ajax({
      type: 'PUT',
      url: url,
      data: JSON.stringify(thing),
      headers: {
        'content-type': 'application/json'
      }
    }).done(function (data, textStatus, jqXHR) {
      console.log('Thing.updateThing: ' + id);
      if (callback) {
        callback(data);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };

  /**
   * Delete a Thing.
   * @param {function} callback A callback to run on success
   */
  deleteThing = function (id, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('Thing.deleteThing url: ' + url);
    $.ajax({
      type: 'DELETE',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('Thing.deleteThing statusCode: ' + data.statusCode);
      if (callback) {
        callback(data);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };

  /**
   * Delete all Things.
   * @param {function} callback A callback to run on success
   */
  deleteAllThings = function (callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/search?collection=' + collection;
    console.log('Thing.deleteAllThings url: ' + url);
    $.ajax({
      type: 'DELETE',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('Thing.deleteAllThings statusCode: ' + data.statusCode);
      if (callback) {
        callback(data);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };

  // Public API
  return {
    createThing: createThing,
    getThing: getThing,
    getAllThings: getAllThings,
    updateThing: updateThing,
    deleteThing: deleteThing,
    deleteAllThings: deleteAllThings
  };

};
