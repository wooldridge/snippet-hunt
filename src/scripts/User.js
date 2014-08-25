var APP = APP || {};

/**
 * Class representing a User.
 * @constructor
 * @param config A configuration object.
 */
APP.User = function (config) {
    'use strict';
        // properties
    var id,
        username,
        score,

        // methods
        getId,
        getUsername,
        getScore,
        changeScore,
        saveNewUser,
        updateUser;

    // initialize properties
    config = config || {};

    username = config.username;
    score = config.score || 0;

    /**
     * Get the ID
     * @returns The ID
     */
    getId = function () {
        return id;
    };

    /**
     * Get the username
     * @returns The username
     */
    getUsername = function () {
        return username;
    };

    /**
     * Get the latitude
     * @returns The latitude
     */
    getScore = function () {
        return score;
    };

    /**
     * Change the score.
     */
    changeScore = function (n, callback) {
        score += n;
        updateUser(localStorage.getItem('userId'));
    };

    saveNewUser = function (callback) {
      var url = 'http://' + APP.config.getHost() + ':' + APP.config.getPort();
          url += '/v1/documents?extension=json&directory=/users/';
      console.log('saveNewUser url: ' + url);
      var json = {
          username: getUsername(),
          score: getScore()
      };
      json = JSON.stringify(json);
      $.ajax({
          type: 'POST',
          url: url,
          data: json,
          // IMPORTANT: Do not set 'dataType: "json"' since REST server
          // returns an empty body on success, which is invalid JSON
          headers: {
              'content-type': 'application/json'
          }
      }).done(function (data) {
          console.log('User posted: ' + data);
          // /v1/documents?uri=4123628437005578381.json
          id = data.location.substring(25, 45);
          if(callback) {
            callback();
          }
      }).error(function (data) {
          console.log(data);
      });
    };

    updateUser = function (id) {
      var url = 'http://' + APP.config.getHost() + ':' + APP.config.getPort();
          url += '/v1/documents?uri=/users/' + id + '.json';
      console.log('updateUser url: ' + url);
      var json = {
          username: getUsername(),
          score: getScore()
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
          console.log('User updated: ' + id);
          console.log('Triggering updateUserDone');
          $('#map-canvas').trigger('updateUserDone');
      }).error(function (data) {
          console.log(data);
      });
    };


    // Public API
    return {
        getId: getId,
        getUsername: getUsername,
        getScore: getScore,
        changeScore: changeScore,
        saveNewUser: saveNewUser,
        updateUser: updateUser
    };

};
