var APP = APP || {};

/**
 * Class for managing Users.
 * @constructor
 * @param config A configuration object.
 */
APP.Users = function (config) {
  'use strict';
    // properties
  var users,
      directory,

    // methods
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser;

  // initialize properties
  config = config || {};

  users = [];
  directory = 'users';

  /**
   * Create a User.
   * @param {function} callback A callback to run on success
   */
  createUser = function (user, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?extension=json&directory=/' + directory + '/';
    console.log('User.createUser url: ' + url);
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(user),
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
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('User.get url: ' + url);
    $.ajax({
      type: 'GET',
      url: url
    }).done(function (data, textStatus, jqXHR) {
      console.log('User.getAllUsers: ' + JSON.stringify(data));
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
   * Update a User.
   * @param {function} callback A callback to run on success
   */
  updateUser = function (id, user, callback) {
    var url = 'http://' + config.host + ':' + config.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
    console.log('User.updateUser url: ' + url);
    var json = JSON.stringify(user);
    $.ajax({
      type: 'PUT',
      url: url,
      data: JSON.stringify(user),
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

  // Public API
  return {
    createUser: createUser,
    getUser: getUser,
    getAllUsers: getAllUsers,
    updateUser: updateUser,
    deleteUser: deleteUser
  };

};
