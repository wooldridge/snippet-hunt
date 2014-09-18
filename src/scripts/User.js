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
        json,

        // methods
        getId,
        setId,
        getUsername,
        getScore,
        changeScore,
        toJSON;

    // initialize properties
    config = config || {};

    id = config.id || '';
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
     * Set the ID
     * @param The new ID
     */
    setId = function (newId) {
        id = newId;
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
     * Change the user's score.
     */
    changeScore = function (n, callback) {
        score += n;
    };

    /**
     * Get a JSON version of the user.
     */
    toJSON = function () {
        json = {
            username: getUsername() || '',
            score: getScore() || 0
        };
        return JSON.stringify(json);
    };

    // Public API
    return {
        getId: getId,
        setId: setId,
        getUsername: getUsername,
        getScore: getScore,
        changeScore: changeScore,
        toJSON: toJSON
    };

};

if (typeof window === 'undefined') {
    module.exports = APP.User;
}

