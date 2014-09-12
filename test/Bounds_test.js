var expect = chai.expect;

describe("Bounds", function() {

  this.timeout(5000);

  var boundsConfig = {
    lat1: 37,
    lon1: 122,
    lat2: 38,
    lon2: 123
  };

  describe("getRandCoords", function() {
    var bounds = new APP.Bounds(boundsConfig);
    it("should get random coordinates within the Bounds", function() {
      var coords = bounds.getRandCoords();
      expect(coords.lat).to.be.above(boundsConfig.lat1);
      expect(coords.lat).to.be.below(boundsConfig.lat2);
      expect(coords.lon).to.be.above(boundsConfig.lon1);
      expect(coords.lon).to.be.below(boundsConfig.lon2);
    });
  });

});
