var expect = chai.expect;

describe("Things", function() {

  this.timeout(5000);

  var config = APP.Config();
  var boundsConfig = {
    lat1: 37.885454 - 0.0007,
    lon1: -122.063447 - 0.001,
    lat2: 37.885454 + 0.0007,
    lon2: -122.063447 + 0.001
  };
  var thing = {};
  var updatedThing = {};
  var id = '';

  describe("createThing", function() {
    it("should create a Thing and get an ID", function(done) {
      gameBounds = APP.Bounds(boundsConfig);
      var coords = gameBounds.getRandCoords();
      var createConfig = {
        lat: coords.lat,
        lon: coords.lon
      }
      var things = new APP.Things(config);
      things.createThing(createConfig, function (data) {
        thing = data;
        id = thing.getId();
        expect(thing.getId()).to.exist;
        done();
      });
    });
  });

  describe("getThing", function() {
    it("should get the created Thing", function(done) {
      var things = new APP.Things(config);
      things.getThing(id, function (data) {
        thing = new APP.Thing(data);
        expect(thing.getLat()).to.be.above(boundsConfig.lat1);
        expect(thing.getLat()).to.be.below(boundsConfig.lat2);
        expect(thing.getLon()).to.be.above(boundsConfig.lon1);
        expect(thing.getLon()).to.be.below(boundsConfig.lon2);
        done();
      });
    });
  });

  describe("updateThing", function() {
    it("should update the created Thing", function(done) {
      var things = new APP.Things(config);
      var updatedConfig = {
        lat: thing.getLat() + 1,
        lon: thing.getLon() + 1
      };
      updatedThing = new APP.Thing(updatedConfig);
      things.updateThing(id, updatedConfig, function (data) {
        expect(data).to.exist;
        things.getThing(id, function (data) {
          updatedThing = new APP.Thing(data);
          expect(updatedThing.getLat()).to.equal(updatedConfig.lat);
          expect(updatedThing.getLon()).to.equal(updatedConfig.lon);
          done();
        });
      });
    });
  });

  describe("deleteThing", function() {
    it("should delete the updated Thing", function(done) {
      var users = new APP.Things(config);
      users.deleteThing(id, function (data) {
        expect(data).to.exist;
        users.getThing(id, function (data) {
          expect(data.status).to.equal(404);
          done();
        });
      });
    });
  });

});
