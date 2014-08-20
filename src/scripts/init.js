var APP = APP || {};

$(function () {

  function show_map(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    alert('lat: ' + latitude + ', lon: ' + longitude);
  }

  //navigator.geolocation.getCurrentPosition(show_map);

  var config = {};
  // APP.thing = new APP.Thing(config);
  // $('#thingLat').html(APP.thing.getLat());
  // $('#thingLon').html(APP.thing.getLon());

  // APP.player = new APP.Player(config);
  // APP.player.getLat(function (position) {
  //   $('#playerLat').html(position.coords.latitude);
  // });
  // APP.player.getLon(function (position) {
  //   $('#playerLon').html(position.coords.longitude);
  // });

  APP.game = new APP.Game(config);
  APP.game.initialize();


  //APP.game.addThing(10);
  //var things = APP.game.getThings();

  // var mapOptions = {
  //   center: new google.maps.LatLng(37.88, -122.06),
  //   zoom: 2
  // };
  // var map = new google.maps.Map(document.getElementById("map-canvas"),
  //     mapOptions);

  // for (var i = 0; i < things.length; i++) {
  //   things[i].showMarker(map);
  // }

  // var GeoMarker = new GeolocationMarker(map);

});

