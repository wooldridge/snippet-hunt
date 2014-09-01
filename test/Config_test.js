var expect = chai.expect;

describe("Config", function() {

  this.timeout(5000);

  var myLat = 38;
  var myLon = 122;

  config = new APP.Config(myLat, myLon);

  describe("constructor", function(done) {
    it("should return a config object", function() {
      expect(config).to.exist;
      expect(config).to.have.property('admin');
      expect(config).to.have.property('game');
      expect(config).to.have.property('user');
    });
  });

});
