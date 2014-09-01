var expect = chai.expect;

describe("UserMgr", function() {

  this.timeout(5000);

  var config = APP.Config();
  var user = {
    username: 'testname',
    score: 0
  }
  var updatedUser = {
    username: 'testname2',
    score: 1
  }
  var id = '';

  var users = new APP.UserMgr(config.get('admin'));

  describe("createUser", function() {
    it("should create a User and get an ID", function(done) {
      users.createUser(user, function (data) {
        id = data;
        expect(id).to.exist;
        done();
      });
    });
  });

  describe("getUser", function() {
    it("should get the created User", function(done) {
      users.getUser(id, function (data) {
        expect(data.username).to.equal(user.username);
        expect(data.score).to.equal(user.score);
        done();
      });
    });
  });

  describe("updateUser", function() {
    it("should update the created User", function(done) {
      users.updateUser(id, updatedUser, function (data) {
        expect(data).to.exist;
        users.getUser(id, function (data) {
          expect(data.username).to.equal(updatedUser.username);
          expect(data.score).to.equal(updatedUser.score);
          done();
        });
      });
    });
  });

  describe("deleteUser", function() {
    it("should delete the updated User", function(done) {
      users.deleteUser(id, function (data) {
        expect(data).to.exist;
        users.getUser(id, function (data) {
          expect(data.status).to.equal(404);
          done();
        });
      });
    });
  });

});
