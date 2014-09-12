var expect = chai.expect;

describe("Thing", function() {

  this.timeout(5000);

  var thingConfig = {
    lat: 37,
    lon: 122,
    value: 7
  };
  var id = '123abc';
  var thing;
  var marker;
  var player;

  var mapConfig = {
    id: 'map-canvas-test',
    myLat: 38,
    myLon: 122,
    mapOptions: {},
    rectOptions: {}
  };
  $('body').append('<div id="' + mapConfig.id + '"></div>');
  var map = new APP.Map(mapConfig);
  var googleMap;

  describe("constructor", function() {
    it("should instantiate a Thing", function() {
      thing = new APP.Thing(thingConfig);
      expect(thing).to.be.an('object');
      expect(thing.getLat()).to.equal(thingConfig.lat);
      expect(thing.getLon()).to.equal(thingConfig.lon);
      expect(thing.getValue()).to.equal(thingConfig.value);
    });
  });

  describe("setId", function() {
    it("should set the ID of the Thing", function() {
      thing.setId(id);
      expect(thing.getId()).to.equal(id);
    });
  });

  describe("showMarker", function() {
    it("should show a marker for the Thing", function(done) {
      map.showMap();
      googleMap = map.getMap();
      google.maps.event.addListenerOnce(googleMap, 'idle', function(){
        thing.showMarker(map);
        expect(thing.getMarker().icon).is.equal(thing.getMarkerIcon());
        done();
      });
    });
    it("should handle a click on the marker", function(done) {
      marker = thing.getMarker();
      google.maps.event.addListener(marker, 'click', function(){
        expect(this).to.have.property('map');
        expect(this).to.have.property('position');
        done();
      });
      map.showPlayer();
      player = map.getPlayer();
      google.maps.event.addListener(player, 'position_changed', function(){
        google.maps.event.trigger(marker, 'click');
      });
    });
  });

});
