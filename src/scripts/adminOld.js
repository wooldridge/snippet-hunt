var APP = APP || {};

$(function () {

  var mlhost = 'localhost';
  var mlport = 9055;

  var displayForm = function () {

    var lat1 = $('#lat1').val();
    var lon1 = $('#lon1').val();
    var lat2 = $('#lat2').val();
    var lon2 = $('#lon2').val();

    var mapOptions = {
      center: new google.maps.LatLng(37.885454, -122.063447),
      zoom: 18
    };
    var map = new google.maps.Map(document.getElementById('map-canvas-admin'),
        mapOptions);

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(parseFloat(lat1), parseFloat(lon1)),
        new google.maps.LatLng(parseFloat(lat2), parseFloat(lon2))
        //new google.maps.LatLng(37.885, -122.064),
        //new google.maps.LatLng(37.886, -122.063)
    );

    // Define the rectangle and set its editable property to true.
    var rectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true
    });

    rectangle.setMap(map);

    // Add an event listener on the rectangle.
    google.maps.event.addListener(rectangle, 'bounds_changed', function (event) {

      var ne = rectangle.getBounds().getNorthEast();
      var sw = rectangle.getBounds().getSouthWest();

      $('#lat1')[0].value = sw.lat();
      $('#lon1')[0].value = ne.lng();
      $('#lat2')[0].value = ne.lat();
      $('#lon2')[0].value = sw.lng();

    });
  }


  APP.mapStyles = new APP.MapStyles();
  var styles = APP.mapStyles.getStyles();
  $.each(styles, function (i, style) {
    $('#mapStyles').append($('<option>', {
        value: style,
        text: style
    }));
  });

  var submit = getParameterByName('submit');
  if (submit === 'Submit') {
    var config = {
      lat1: parseFloat(getParameterByName('lat1', 37.506)),   // south horiz
      lon1: parseFloat(getParameterByName('lon1', -122.248)), // west vert
      lat2: parseFloat(getParameterByName('lat2', 37.508)),   // north horiz
      lon2: parseFloat(getParameterByName('lon2', -122.246)),  // east vert
      style: getParameterByName('mapStyle', 'subtleGrayscale'),
      numThings: parseInt(getParameterByName('numThings', 10))
    };
    var url = 'http://' + mlhost + ':' + mlport + '/v1/documents?uri=config.json';
    json = JSON.stringify(config);
    $.ajax({
        type: 'PUT',
        url: url,
        data: json,
        headers: {
            'content-type': 'application/json'
        }
    }).done(function (data) {
        console.log('Config posted: ' + json);
        displayForm();
    }).error(function (data) {
        console.log(data);
    });
  } else {
    displayForm();
  }

});

