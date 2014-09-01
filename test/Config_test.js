var expect = chai.expect;

describe("Config", function() {

  this.timeout(5000);

  var myLat = 38;
  var myLon = 122;
  var lat1 = myLat - 1;
  var lon1 = myLon - 1;
  var lat2 = myLat + 1;
  var lon2 = myLon + 1;

  var id;

  var mapStyles = APP.MapStyles();
  var styleIds = mapStyles.getStyles();

  describe("get", function(done) {
    config = new APP.Config(myLat, myLon);
    it("should get a config for Admin", function() {
      var adminConfig = config.get('admin');
      expect(adminConfig.host).to.exist;
      expect(adminConfig.numThings).to.exist;
      expect(adminConfig.score).to.not.exist;
    });
    it("should get a config for Game", function() {
      var adminConfig = config.get('game');
      expect(adminConfig.host).to.exist;
      expect(adminConfig.scoreId).to.exist;
      expect(adminConfig.score).to.not.exist;
    });
  });

  describe("saveConfig", function(done) {
    config = new APP.Config(myLat, myLon);
    var configToSave = {
      lat1: lat1,   // south horiz
      lon1: lon1,   // west vert
      lat2: lat2,   // north horiz
      lon2: lon2,   // east vert
      mapStyle: styleIds[0],
      numThings: 10
    };
    it("should save a game-specific config and set a Game ID", function(done) {
      config.saveConfig(configToSave, function (data) {
        id = data;
        expect(id).to.exist;
        expect(localStorage.getItem('gameId')).to.exist;
        done();
      });
    });
  });

  describe("getSavedConfig", function(done) {
    it("should get the Game config", function(done) {
      config.getSavedConfig(id, function (data) {
        expect(data.lat1).to.exist;
        expect(data.lat1).to.equal(lat1);
        done();
      });
    });
  });

  describe("getHost", function() {
    it("should get the host", function(done) {
      config.getSavedConfig(id, function (data) {
        expect(data.lat1).to.exist;
        expect(data.lat1).to.equal(lat1);
        done();
      });
    });
  });

  describe("getPort", function() {
    config = new APP.Config(myLat, myLon);
    it("should get the host", function() {
      var host = config.getHost();
      expect(host).to.be.a('string');
    });
    it("should get the port", function() {
      var port = config.getPort();
      expect(port).to.be.a('number');
    });
  });

});
