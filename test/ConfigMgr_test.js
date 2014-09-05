var expect = chai.expect;

describe("ConfigMgr", function() {

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

  var configMgr = new APP.ConfigMgr(myLat, myLon);

  var configToSave = {
    lat1: lat1,   // south horiz
    lon1: lon1,   // west vert
    lat2: lat2,   // north horiz
    lon2: lon2,   // east vert
    mapStyle: styleIds[0],
    numThings: 10
  };

  describe("get", function(done) {
    it("should get a config for Admin", function() {
      var adminConfig = configMgr.get('admin');
      expect(adminConfig.host).to.exist;
      expect(adminConfig.numThings).to.exist;
      expect(adminConfig.score).to.not.exist;
    });
    it("should get a config for Game", function() {
      var adminConfig = configMgr.get('game');
      expect(adminConfig.host).to.exist;
      expect(adminConfig.scoreId).to.exist;
      expect(adminConfig.score).to.not.exist;
    });
  });

  describe("saveConfig", function(done) {
    it("should save a game-specific config and set a Game ID", function(done) {
      configMgr.saveConfig(configToSave, function (data) {
        id = data;
        expect(id).to.exist;
        expect(localStorage.getItem('gameId')).to.exist;
        done();
      });
    });
  });

  describe("getSavedConfig", function(done) {
    it("should get the Game config", function(done) {
      configMgr.getSavedConfig(id, function (data) {
        expect(data.lat1).to.exist;
        expect(data.lat1).to.equal(lat1);
        done();
      });
    });
  });

  describe("deleteSavedConfig", function(done) {
    it("should delete the Game config", function(done) {
      configMgr.deleteSavedConfig(id, function (data) {
        expect(data.statusCode).to.equal(204);
        done();
      });
    });
  });

  describe("deleteAllSavedConfigs", function() {
    it("should create two configs and delete them", function(done) {
      configMgr.saveConfig(configToSave, function (data) {
        expect(localStorage.getItem('gameId')).to.equal(data);
        configMgr.saveConfig(configToSave, function (data) {
          expect(localStorage.getItem('gameId')).to.equal(data);
          configMgr.deleteAllSavedConfigs(function (data) {
            expect(data.statusCode).to.equal(204);
            done();
          });
        });
      });
    });
  });

  describe("getHost", function() {
    it("should get the host", function() {
      var host = configMgr.getHost();
      expect(host).to.be.a('string');
    });
  });

  describe("getPort", function() {
    it("should get the port", function() {
      var port = configMgr.getPort();
      expect(port).to.be.a('number');
    });
  });

});
