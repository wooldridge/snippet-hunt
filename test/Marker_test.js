var expect = chai.expect;

describe("Marker", function() {

  this.timeout(5000);

  var mapConfig = {
    id: 'map-canvas-test',
    myLat: 38,
    myLon: 122,
    mapOptions: {},
    rectOptions: {}
  };
  $('body').append('<div id="' + mapConfig.id + '"></div>');
  var map = new APP.Map(mapConfig);

  var markerConfig = {
    id: 'abc123',
    lat: 37,
    lon: 123,
    name: 'markerName',
    size: 'small',
    zIndex: 99,
    map: map,
    type: 'markerType'
  };

  var size = 'large';
  var marker, googleMap, player, googleMarker;

  describe("constructor", function() {
    it("should instantiate a Marker", function() {
      marker = new APP.Marker(markerConfig);
      expect(marker).to.be.an('object');
      expect(marker.getLat()).to.equal(markerConfig.lat);
    });
  });

  describe("setSize", function() {
    it("should set the size of the Marker", function() {
      marker = new APP.Marker(markerConfig);
      marker.setSize(size);
      expect(marker.getSize()).to.equal(size);
    });
  });

  describe("showMarker", function() {
    it("should show a marker on the Map", function(done) {
      marker = new APP.Marker(markerConfig);
      map.showMap();
      googleMap = map.getMap();
      google.maps.event.addListenerOnce(googleMap, 'idle', function(){
        marker.showMarker(map);
        googleMarker = marker.getGoogleMarker();
        expect(googleMarker.getIcon().url).is.equal(marker.getMarkerIcon().url);
        done();
      });
    });
    it("should handle a click on the marker", function(done) {
      google.maps.event.addListener(googleMarker, 'click', function(){
        expect(this).to.have.property('map');
        expect(this).to.have.property('position');
        done();
      });
      map.showPlayer();
      player = map.getPlayer();
      google.maps.event.addListener(player, 'position_changed', function(){
        google.maps.event.trigger(googleMarker, 'click');
      });
    });
  });

});
