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
        saveUser;

    // initialize properties
    config = config || {};

    id = config.id || 2002;
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
        saveUser(callback);
    };

    saveUser = function (callback) {
      var url = 'http://' + APP.config.getHost() + ':' + APP.config.getPort();
          url += '/v1/documents?uri=user_' + getId();
          url += '&collection=user';
      var json = {
          id: getId(),
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
          console.log('User posted: ' + data);
          if(callback) {
            callback();
          }
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
        saveUser: saveUser
    };

};
