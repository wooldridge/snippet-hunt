var expect = chai.expect;

describe("Map", function() {

  this.timeout(5000);

  var mapStyles = APP.MapStyles();
  var styleIds = mapStyles.getStyles();

  var mapConfig = {
    id: 'map-canvas-test',
    style: styleIds[0],
    myLat: 38,
    myLon: 122,
    mapOptions: {},
    rectOptions: {},
    mapStyles: new APP.MapStyles()
  };

  $('body').append('<div id="' + mapConfig.id + '"></div>');

  var map = new APP.Map(mapConfig);
  var googleMap;
  var rectangle;
  var player;

  describe("showMap", function() {
    it("should show a map", function(done) {
      map.showMap();
      googleMap = map.getMap();
      google.maps.event.addListenerOnce(googleMap, 'idle', function(){
        var mapEl = $('#' + mapConfig.id + ' .gm-style');
        expect(mapEl.length).to.be.above(0);
        done();
      });
    });
  });

  describe("setMapType", function() {
    it("should set a map style type", function() {
      map.loadMapTypes(styleIds);
      map.setMapType(styleIds[1]);
      expect(googleMap.getMapTypeId()).to.equal(styleIds[1]);
    });
  });

  describe("showRectangle", function() {
    it("should show a rectangle on the map", function(done) {
      var boundsConfig = {
        lat1: 37,
        lon1: 122,
        lat2: 38,
        lon2: 123
      };
      var bounds = new APP.Bounds(boundsConfig);
      map.showRectangle(bounds);
      rectangle = map.getRectangle();
      google.maps.event.addListener(rectangle, 'click', function(){
        expect(this.editable).to.be.true;
        expect(this.draggable).to.be.true;
        expect(this.map.getDiv().id).to.equal('map-canvas-test');
        done();
      });
      google.maps.event.trigger(rectangle, 'click');
    });
  });

  describe("disableRectangle", function() {
    it("should disable the rectangle on the map", function() {
      map.disableRectangle();
      expect(rectangle.getEditable()).to.be.false;
      expect(rectangle.getDraggable()).to.be.false;
    });
  });

  describe("showPlayer", function() {
    it("should show player on the map", function(done) {
      map.showPlayer();
      player = map.getPlayer();
      google.maps.event.addListener(player, 'position_changed', function(){
        expect(this.circle_.radius).to.equal(20);
        expect(this.map.getDiv().id).to.equal('map-canvas-test');
        done();
      });
      google.maps.event.trigger(player, 'position_changed');
    });
  });

});
