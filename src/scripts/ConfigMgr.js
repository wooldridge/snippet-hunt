var APP = APP || {};

/**
 * Class representing configuration.
 * @constructor
 * @param config A configuration object.
 */
APP.ConfigMgr = function (myLat, myLon) {
    'use strict';
        // properties
    var config,
        url,
        myLat,
        myLon,
        directory,
        collection,
        savedConfig,
        deleteSavedConfig,
        deleteAllSavedConfigs,

        // methods
        get,
        saveConfig,
        getSavedConfig,
        getHost,
        getPort;

    // initialize
    myLat = myLat || 0;
    myLon = myLon || 0;

    directory = 'configs';
    collection = 'configs';

    // initialize properties
    config = new APP.Config(myLat, myLon);

    /**
     * Get a configuration
     * @param id The configuration ID
     * @returns The configuration object
     */
    get = function (id) {
      var result = {};
      $.extend(result, config[id], config['global']);
      return result;
    };


    /**
     * Save game-specific config data to db
     */
    saveConfig = function (configToSave, callback) {
      url = 'http://' + config.global.host + ':' + config.global.port;
      url += '/v1/documents?extension=json&directory=/' + directory + '/';
      url += '&collection=' + collection;
      console.log('Config.saveConfig url: ' + url);
      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(configToSave),
        headers: {
          'content-type': 'application/json'
        }
      }).done(function (data, textStatus, jqXHR) {
        console.log('Config.saveConfig: ' + data.headers.location);
        // data.headers.location:
        // /v1/documents?uri=/configs/4123628437005578381.json
        var id = data.headers.location
             .slice(0, data.headers.location.length - 5)
             .substring(27);
        localStorage.setItem('gameId', id);
        console.log('localStorage gameId: ' + data.headers.location);
        if(callback) {
          callback(id);
        }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        if (callback) {
          callback(jqXHR);
        }
      });
    }

    /**
     * Get game-specific config data from db
     */
    getSavedConfig = function (id, callback) {
      url = 'http://' + config.global.host + ':' + config.global.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
      console.log('Config.getSavedConfig url: ' + url);
      $.ajax({
          type: 'GET',
          url: url
      }).done(function (data, textStatus, jqXHR) {
          console.log('Config.getSavedConfig: ' + JSON.stringify(data));
          if (callback) {
            callback(data);
          }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        if (callback) {
          callback(jqXHR);
        }
      });
    }

    /**
     * Delete game-specific config data from db
     */
    deleteSavedConfig = function (id, callback) {
      url = 'http://' + config.global.host + ':' + config.global.port;
      url += '/v1/documents?uri=/' + directory + '/' + id + '.json';
      console.log('Config.deleteSavedConfig url: ' + url);
      $.ajax({
          type: 'DELETE',
          url: url
      }).done(function (data, textStatus, jqXHR) {
          console.log('Config.deleteSavedConfig statusCode: ' + data.statusCode);
          if (callback) {
            callback(data);
          }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        if (callback) {
          callback(jqXHR);
        }
      });
    }

    /**
     * Delete all game-specific config data from db
     */
    deleteAllSavedConfigs = function (callback) {
      url = 'http://' + config.global.host + ':' + config.global.port;
      url += '/v1/search?collection=' + collection;
      console.log('Config.deleteAllSavedConfigs url: ' + url);
      $.ajax({
          type: 'DELETE',
          url: url
      }).done(function (data, textStatus, jqXHR) {
          console.log('Config.deleteAllSavedConfigs statusCode: ' + data.statusCode);
          if (callback) {
            callback(data);
          }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        if (callback) {
          callback(jqXHR);
        }
      });
    }

    getHost = function () {
      return config.global.host;
    }

    getPort = function () {
      return config.global.port;
    }

    // Public API
    return {
      get: get,
      saveConfig: saveConfig,
      getSavedConfig: getSavedConfig,
      deleteSavedConfig: deleteSavedConfig,
      deleteAllSavedConfigs: deleteAllSavedConfigs,
      getHost: getHost,
      getPort: getPort
    };

};
