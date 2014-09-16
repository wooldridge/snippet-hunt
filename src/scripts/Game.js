var APP = APP || {};

/**
 * Class representing a game.
 * @constructor
 * @param config A configuration object.
 * @param socket A web socket.
 */
APP.Game = function (config, socket) {
  'use strict';
      // properties
  var boundsConfig,
      bounds,
      mapConfig,
      map,
      thing,
      things,
      thingMgr,
      user,
      userId,
      userMgr,
      currZoom,
      newZoom,
      currThresh,
      newThresh,
      smallThresh,
      tinyThresh,

      // methods
      displayScore,
      changeScore,
      displayUser,
      loadUser,
      displayGame;

 /**
  * boundsConfig describes the playing space
  * @example home: 37.885454, -122.063447
  * @example work: 37.507278, -122.246814
  */
  boundsConfig = {
    lat1: config.lat1,
    lon1: config.lon1,
    lat2: config.lat2,
    lon2: config.lon2
  };
  bounds = new APP.Bounds(boundsConfig);

  mapConfig = {
    id: config.mapCanvasId,
    style: config.mapStyle,
    mapStyles: config.mapStyles,
    myLat: config.myLat,
    myLon: config.myLon,
    mapOptions: {
      zoom: 18,
      maxZoom: 20,
      minZoom: 17,
      panControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false
    }
  };
  map = new APP.Map(mapConfig, bounds);

  things = [];
  smallThresh = 18;
  tinyThresh = 16;
  currThresh = 'large';
  userMgr = new APP.UserMgr(APP.configMgr.get('user'));
  thingMgr = new APP.ThingMgr(APP.configMgr.get('user'));

  /**
   * Display the username in the UI.
   */
  displayUser = function () {
      $('#' + config.userId).html(user.getUsername());
  };

  /**
   * Display the score in the UI.
   */
  displayScore = function () {
      $('#' + config.scoreId).html(user.getScore());
  };

  /**
   * Change the score.
   */
  changeScore = function (n) {
      user.changeScore(n, displayScore);
  };

  /**
   * Load user data. Display user form if needed.
   */
  loadUser = function () {
      // Handle submission of user form

      $('#usernameForm').validate({ // initialize the plugin
        rules: {
            usernameInput: {
                required: true,
                validEmail: true
            }
        },
        submitHandler: function (form) {
          var userConfig = {
            username: $('#usernameInput').val(),
          };
          user = new APP.User(userConfig);
          userMgr.createUser(user.toJSON(), function (id) {
              $('#usernameModal').modal('hide');
              localStorage.setItem('userId', id);
              displayGame();
          });
          return false;
        }
      });
      // Get user data from localStorage and database
      userId = localStorage.getItem('userId');
      if(!userId) {
          $('#usernameModal').modal({});
      } else {
          userMgr.getUser(userId, function (data) {
              if (data.statusText && data.statusText === 'Not Found') {
                  $('#usernameModal').modal({});
              } else {
                  user = new APP.User(data);
                  displayGame();
              }
          });
      }
  };

  // Custom email validator
  $.validator.addMethod("validEmail", function(value, element) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
  }, "Please enter a valid email address.");

  /**
   * Initialize the game.
   */
  displayGame = function () {
      displayScore();
      //displayUser();
      map.showMap();
      currZoom = map.getMap().getZoom();
      map.showPlayer();
      thingMgr.getAllThings(function (results) {
          things = results;
          map.showMarkers(things);
      });

      function compare(u1, u2) {
        if (u1.getScore() > u2.getScore()) {
          return -1;
        }
        if (u1.getScore() < u2.getScore()) {
          return 1;
        }
        return 0;
      }

      // Handle leaders link
      $('a#leadersLink').click(function () {
          $('#leadersList').empty();
          $('#leadersModal').modal({});
          userMgr.getAllUsers(function (users) {
            users.sort(compare);
            $.each(users, function (index, user) {
              var html =
              $('#leadersList').append('<li>' +
                '<span class="leadersUsername">' + user.getUsername() + '</span>' +
                '<span class="leadersScore">' + user.getScore() + '</span></li>');
            });
          });
          return false;
      });

      // Handle leaders close
      $('button#leadersClose').click(function () {
          $('#leadersModal').modal('hide');
      });

      $('#map-canvas').on('deleteThing', function (ev, id) {
          thingMgr.deleteThing(id, function () {
              for (var i = 0; i < things.length; i++) {
                if (things[i].getId() === id) {
                  things.splice(i, 1);
                  break;
                }
              }
              socket.emit('thingDeleted', { 'id': id });
          });
      });

      socket.on('thingDeleted', function (data) {
          console.log('thingDeleted received, cycling through things');
          for (var i = 0; i < things.length; i++) {
            if (things[i].getId() === data.id) {
              console.log('thing to hide found, calling things[i].hideMarker()');
              things[i].hideMarker();
              var snd = new Audio("audio/error.mp3");
              snd.play();
              break;
            }
          }
      });

      $('#' + config.mapCanvasId).on('scoreChanged', function () {
          userMgr.updateUser(localStorage.getItem('userId'), user.toJSON());
      });

      google.maps.event.addListener(map.getMap(), 'zoom_changed', function() {
          newZoom = map.getMap().getZoom();
          console.log('Zoom changed: '+ newZoom);
          // Get curr thresh...
          if (newZoom <= smallThresh) {
              if (newZoom <= tinyThresh) {
                  newThresh = 'tiny';
              } else {
                  newThresh = 'small';
              }
          } else {
              newThresh = 'large';
          }
          // Has it changed? Then update...
          if (currThresh !== newThresh) {
              for (var i = 0; i < things.length; i++) {
                  things[i].setMarkerIcon(newThresh);
              }
          }
          currZoom = newZoom;
          currThresh = newThresh;
      });

    };

  // Public API
  return {
      displayScore: displayScore,
      changeScore: changeScore,
      loadUser: loadUser,
      displayGame: displayGame
  };

};
