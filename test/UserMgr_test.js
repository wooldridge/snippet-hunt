var expect = chai.expect;

describe("UserMgr", function() {

  this.timeout(5000);

  var config = APP.ConfigMgr();
  var user = {
    username: 'testname',
    score: 0
  }
  var user2 = {
    username: 'testname2',
    score: 1
  }
  var updatedUser = {
    username: 'testname3',
    score: 10
  }
  var id = '';

  var userMgr = new APP.UserMgr(config.get('admin'));

  describe("createUser", function() {
    it("should create a User and get an ID", function(done) {
      userMgr.createUser(user, function (data) {
        id = data;
        expect(id).to.exist;
        done();
      });
    });
  });

  describe("getUser", function() {
    it("should get the created User", function(done) {
      userMgr.getUser(id, function (data) {
        expect(data.username).to.equal(user.username);
        expect(data.score).to.equal(user.score);
        done();
      });
    });
  });

  describe("getAllUsers", function() {
    it("should get all Users", function(done) {
      userMgr.createUser(user2, function (data) {
        userMgr.getAllUsers(function (data) {
          expect(data.length).to.be.above(0);
          expect(data[0].getId()).to.exist;
          done();
        });
      });
    });
  });

  describe("updateUser", function() {
    it("should update the created User", function(done) {
      userMgr.updateUser(id, updatedUser, function (data) {
        expect(data).to.exist;
        userMgr.getUser(id, function (data) {
          expect(data.username).to.equal(updatedUser.username);
          expect(data.score).to.equal(updatedUser.score);
          done();
        });
      });
    });
  });

  describe("deleteUser", function() {
    it("should delete the updated User", function(done) {
      userMgr.deleteUser(id, function (data) {
        expect(data).to.exist;
        userMgr.getUser(id, function (data) {
          expect(data.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe("deleteAllUsers", function() {
    it("should delete all users", function(done) {
      userMgr.deleteAllUsers(function (data) {
        expect(data.statusCode).to.equal(204);
        userMgr.getAllUsers(function (data) {
          expect(data.length).to.equal(0);
          done();
        });
      });
    });
  });

});
