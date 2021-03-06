var APP = APP || {};

/**
 * Class for managing Users.
 * @constructor
 * @param config A configuration object.
 */
APP.UserMgr = function (config) {
  'use strict';
    // properties
  var users,
      user,
      directory,
      collection,

    // methods
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    deleteAllUsers;

  // initialize properties
  config = config || {};

  users = [];
  directory = 'users';
  collection = 'users';

  /**
   * Create a User.
   * @param {function} callback A callback to run on success
   */
  createUser = function (user, callback) {
    var url = 'http://' + config.host + ':' + config.port;
        url += '/v1/documents?extension=json&directory=/' + directory + '/';
        url += '&collection=' + collection;
    console.log('User.createUser url: ' + url);
    user = (typeof user === 'string') ? user : JSON.stringify(user);
    $.ajax({
      type: 'POST',
      url: url,
      data: user,
      headers: {
        'content-type': 'application/json'
      }
    }).done(function (data, textStatus, jqXHR) {
      console.log('User.createUser: ' + data.headers.location);
      // data.headers.location:
      // /v1/documents?uri=/users/4123628437005578381.json
      var id = data.headers.location
           .slice(0, data.headers.location.length - 5)
           .substring(25);
      if(callback) {
        callback(id);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };

  /**
   * Get User by ID.
   * @param {string} id The User ID
   * @param {function} callback A callback to run on success
   */
  getUser = function (id, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('User.getUser url: ' + url);
    $.ajax({
      type: 'GET',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('User.getUser: ' + JSON.stringify(data));
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
   * Get all Users.
   * @param {function} callback A callback to run on success
   */
  getAllUsers = function (callback) {
    var url = 'http://' + config.host + ':' + config.port + '/v1/search';
        url += '?format=json&options=argame';
        url += '&directory=/users/&pageLength=999';
    console.log('UserMgr.getAllUsers url: ' + url);
    $.ajax({
      type: 'GET',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('Results retrieved: ' + data.results.length);
      users = [];
      for (var i = 0; i < data.results.length; i++) {
        var userConfig = {
          // uri: /users/10499283988025584566.json
          id: data.results[i].uri
              .slice(0, data.results[i].uri.length - 5)
              .substring(7),
          username: data.results[i].metadata[0].username,
          score: data.results[i].metadata[1].score
        };
        user = new APP.User(userConfig);
        users.push(user); // @todo side effect, remove from here
      }
      //$('#' + config.mapCanvasId).trigger('getAllThingsDone');
      $('#map-canvas').trigger('getAllUsers');
      if (callback) {
        callback(users);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      if (callback) {
        callback(jqXHR);
      }
    });
  };


  /**
   * Update a User.
   * @param {function} callback A callback to run on success
   */
  updateUser = function (id, user, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('User.updateUser url: ' + url);
    user = (typeof user === 'string') ? user : JSON.stringify(user);
    $.ajax({
      type: 'PUT',
      url: url,
      data: user,
      headers: {
        'content-type': 'application/json'
      }
    }).done(function (data, textStatus, jqXHR) {
      console.log('User.updateUser: ' + id);
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
   * Delete a User.
   * @param {function} callback A callback to run on success
   */
  deleteUser = function (id, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('User.deleteUser url: ' + url);
    $.ajax({
      type: 'DELETE',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('User.deleteUser: ' + id);
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
   * Delete all users from db
   */
  deleteAllUsers = function (callback) {
    var url = 'http://' + config.host + ':' + config.port;
    url += '/v1/search?collection=' + collection;
    console.log('Config.deleteAllUsers url: ' + url);
    $.ajax({
        type: 'DELETE',
        url: url
    }).done(function (data, textStatus, jqXHR) {
        console.log('Config.deleteAllUsers statusCode: ' + data.statusCode);
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
    createUser: createUser,
    getUser: getUser,
    getAllUsers: getAllUsers,
    updateUser: updateUser,
    deleteUser: deleteUser,
    deleteAllUsers: deleteAllUsers
  };

};
