var APP = APP || {};

/**
 * Class representing utilities for game.
 * @constructor
 * @param config A configuration object.
 */
APP.Utils = function (config) {
    'use strict';
        // methods
    var getParamByName,

    /**
     * Get the value of a URL parameter.
     * @param name Name of the parameter.
     * @param defaultVal Default value to return if no parameter found.
     * @returns The parameter value (or the default value or '').
     */
    getParamByName = function (name, defaultVal) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results === null) {
          return defaultVal ? defaultVal : '';
        } else {
          return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    };

    // Public API
    return {
        getParamByName: getParamByName
    };

};
