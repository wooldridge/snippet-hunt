var APP = APP || {};

/**
 * Class for managing Things.
 * @constructor
 * @param config A configuration object.
 */
APP.Things = function (config) {
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
    deleteThing;

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
    var url = 'http://' + config.getHost() + ':' + config.getPort();
        url += '/v1/documents?extension=json&directory=/' + directory + '/';
        url += '&collection=' + collection;
    console.log('Thing.createThing url: ' + url);
    var json = {
      lat: thing.getLat(),
      lon: thing.getLon()
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
    var url = 'http://' + config.getHost() + ':' + config.getPort();
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
    var url = 'http://' + config.getHost() + ':' + config.getPort();
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('Thing.get url: ' + url);
    $.ajax({
      type: 'GET',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('Thing.getAllThings: ' + JSON.stringify(data));
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
   * Update a Thing.
   * @param {function} callback A callback to run on success
   */
  updateThing = function (id, thing, callback) {
    var url = 'http://' + config.getHost() + ':' + config.getPort();
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
    var url = 'http://' + config.getHost() + ':' + config.getPort();
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('Thing.deleteThing url: ' + url);
    $.ajax({
      type: 'DELETE',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('Thing.deleteThing: ' + id);
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
    deleteThing: deleteThing
  };

};
