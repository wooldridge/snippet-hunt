var express = require('express'),
    request = require('request'),
    config = require('./config'),
    app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

// Include CORS headers
app.all('*', function(req, res, next){
  // use '*' to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
});

// Build query string from req query params
var buildQuery = function (req) {
  var queryArr = [];
  var qkeys = Object.keys(req.query);
  for (var i = 0; i < qkeys.length; i++) {
    queryArr.push(qkeys[i] + '=' + req.query[qkeys[i]]);
  }
  return queryArr.join('&');
}

// Auth object
// TODO Assumes digest auth, support others
var auth = {
  user: config.mluser,
  pass: config.mlpass,
  sendImmediately: false
}

var oneDay = 86400000; // for caching
app.use(express.compress()); // gzip compression

// Serve static files
app.use(express.static(__dirname + '/src', { maxAge: oneDay }));

// Make a search request: /v1/search GET
app.get('/v1/search', function(req, res){
  var url = 'http://' + config.mlhost + ':' + config.mlport +
            '/v1/search?' + buildQuery(req);
  request({
    method: "GET",
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: auth
  }, function (error, response, body) {
    if (response) {
      if ((response.statusCode >= 200) && (response.statusCode < 300)) {
    	res.set('Content-Type', 'application/json');
        res.send(JSON.parse(body));
      } else {
        console.log('Error: '+ response.statusCode);
        console.log(body);
        res.status(response.statusCode).send();
      }
    } else {
      console.log('Error: No response object');
    }
  });
});

// Add a document: /v1/documents POST
app.post('/v1/documents', function(req, res){
  var url = 'http://' + config.mlhost + ':' + config.mlport +
	        '/v1/documents?' + buildQuery(req);
  console.log('Body: ' + JSON.stringify(req.body));
  request({
    method: "POST",
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: auth,
    body: JSON.stringify(req.body)
  }, function (error, response, body) {
    if (response) {
      if ((response.statusCode >= 200) && (response.statusCode < 300)) {
        res.set('Content-Type', 'application/json');
        res.send(body);
      } else {
        console.log('Error: '+ response.statusCode);
	      console.log(body);
        res.status(response.statusCode).send();
	    }
    } else {
	  console.log('Error: No response object');
	}
  });
});

// Add a document: /v1/documents PUT
app.put('/v1/documents', function(req, res){
  var url = 'http://' + config.mlhost + ':' + config.mlport +
          '/v1/documents?' + buildQuery(req);
  console.log('Body: ' + JSON.stringify(req.body));
  request({
    method: "PUT",
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: auth,
    body: JSON.stringify(req.body)
  }, function (error, response, body) {
    if (response) {
      if ((response.statusCode >= 200) && (response.statusCode < 300)) {
        res.send(); // Note: body is empty on success
      } else {
        console.log('Error: '+ response.statusCode);
        console.log(body);
        res.status(response.statusCode).send();
      }
    } else {
    console.log('Error: No response object');
  }
  });
});

app.listen(config.port);
console.log('Express started on port ' + config.port);
