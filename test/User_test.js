var expect = chai.expect;

describe("User", function() {

  this.timeout(5000);

  var userConfig = {
    username: 'testname',
    score: 0
  };
  var id = '123abc';
  var user;

  describe("constructor", function() {
    it("should instantiate a User", function() {
      user = new APP.User(userConfig);
      expect(user).to.be.an('object');
      expect(user.getUsername()).to.equal(userConfig.username);
      expect(user.getScore()).to.equal(userConfig.score);
    });
  });

  describe("setId", function() {
    it("should set the ID of the User", function() {
      user.setId(id);
      expect(user.getId()).to.equal(id);
    });
  });

  describe("changeScore", function() {
    it("should change the score of the User", function() {
      user.changeScore(1);
      expect(user.getScore()).to.equal(userConfig.score + 1);
    });
  });

});
