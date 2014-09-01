var expect = chai.expect;

describe("MapStyles", function() {

  this.timeout(5000);

  var mapStyles = new APP.MapStyles();
  var styleIds;

  describe("getStyles", function() {
    it("should get an array of style IDs", function() {
      styleIds = mapStyles.getStyles();
      expect(styleIds).to.be.a('array');
      expect(styleIds[0]).to.be.a('string');
    });
  });

  describe("getStyle", function() {
    it("should get a style", function() {
      var style = mapStyles.getStyle(styleIds[0]);
      expect(style).to.be.a('array');
      expect(style[0]).to.be.an('object');
    });
  });

});
