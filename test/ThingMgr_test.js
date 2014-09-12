var expect = chai.expect;

describe("ThingMgr", function() {

  this.timeout(5000);

  var config = APP.ConfigMgr();
  var boundsConfig = {
    lat1: 37.885454 - 0.0007,
    lon1: -122.063447 - 0.001,
    lat2: 37.885454 + 0.0007,
    lon2: -122.063447 + 0.001
  };
  var value = 7;
  var thing = {};
  var updatedThing = {};
  var id = '';

  var thingMgr = new APP.ThingMgr(config.get('admin'));
  var gameBounds = APP.Bounds(boundsConfig);

  describe("createThing", function() {
    it("should create a Thing and get an ID", function(done) {
      var coords = gameBounds.getRandCoords();
      var createConfig = {
        lat: coords.lat,
        lon: coords.lon,
        value: value
      };
      thingMgr.createThing(createConfig, function (data) {
        thing = data;
        id = thing.getId();
        expect(thing.getId()).to.exist;
        done();
      });
    });
  });

  describe("getThing", function() {
    it("should get the created Thing", function(done) {
      thingMgr.getThing(id, function (data) {
        thing = new APP.Thing(data);
        expect(thing.getLat()).to.be.above(boundsConfig.lat1);
        expect(thing.getLat()).to.be.below(boundsConfig.lat2);
        expect(thing.getLon()).to.be.above(boundsConfig.lon1);
        expect(thing.getLon()).to.be.below(boundsConfig.lon2);
        expect(thing.getValue()).to.equal(value);
        done();
      });
    });
  });

  describe("getAllThings", function() {
    it("should get all created Things", function(done) {
      thingMgr.getAllThings(function (data) {
        expect(data.length).to.be.above(0);
        expect(data[0].limit).to.be.above(0);
        done();
      });
    });
  });

  describe("updateThing", function() {
    it("should update the created Thing", function(done) {
      var updatedConfig = {
        lat: thing.getLat() + 1,
        lon: thing.getLon() + 1,
        value: thing.getValue() + 1
      };
      updatedThing = new APP.Thing(updatedConfig);
      thingMgr.updateThing(id, updatedConfig, function (data) {
        expect(data).to.exist;
        thingMgr.getThing(id, function (data) {
          updatedThing = new APP.Thing(data);
          expect(updatedThing.getLat()).to.equal(updatedConfig.lat);
          expect(updatedThing.getLon()).to.equal(updatedConfig.lon);
          expect(updatedThing.getValue()).to.equal(updatedConfig.value);
          done();
        });
      });
    });
  });

  describe("deleteThing", function() {
    it("should delete the updated Thing", function(done) {
      thingMgr.deleteThing(id, function (data) {
        expect(data).to.exist;
        thingMgr.getThing(id, function (data) {
          expect(data.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe("deleteAllThings", function() {
    it("should create two things and delete them", function(done) {
      var coords = gameBounds.getRandCoords();
      var createConfig = {
        lat: coords.lat,
        lon: coords.lon
      };
      thingMgr.createThing(createConfig, function (data) {
        expect(data.getId()).to.exist;
        var coords = gameBounds.getRandCoords();
        var createConfig = {
          lat: coords.lat,
          lon: coords.lon
        };
        thingMgr.createThing(createConfig, function (data) {
          expect(data.getId()).to.exist;
          thingMgr.deleteAllThings(function (data) {
            expect(data.statusCode).to.equal(204);
            done();
          });
        });
      });
    });
  });

});
