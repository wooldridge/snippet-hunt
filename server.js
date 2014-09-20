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
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
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
};

// Auth object
// TODO Assumes digest auth, support others
var auth = {
  user: config.mluser,
  pass: config.mlpass,
  sendImmediately: false
};

var oneDay = 86400000; // for caching
app.use(express.compress()); // gzip compression

// Serve static files
app.use(express.static(__dirname + '/build', { maxAge: oneDay }));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/test', express.static(__dirname + '/test'));

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

// get a document: /v1/documents?uri=[uri] GET
app.get('/v1/documents', function(req, res){
  var url = 'http://' + config.mlhost + ':' + config.mlport +
            '/v1/documents?' + buildQuery(req);
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

// Post a document: /v1/documents?uri=[uri] POST
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
        // response may or may not have body
        if(body) {
          console.log(JSON.stringify(body));
          res.send(body);
        // if not, send response (which includes ML-generated URI in location)
        } else {
          console.log(JSON.stringify(response.headers));
          //res.send(response.headers);
          res.send(response);
        }
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

// Delete a document: /v1/documents?uri=[uri] DELETE
app.delete('/v1/documents', function(req, res){
  var url = 'http://' + config.mlhost + ':' + config.mlport +
          '/v1/documents?' + buildQuery(req);
  request({
    method: "DELETE",
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: auth
  }, function (error, response, body) {
    if (response) {
      if ((response.statusCode >= 200) && (response.statusCode < 300)) {
        res.send(response); // Note: body is empty on success
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

// Delete all documents in collection: /v1/search?collection=[collection] DELETE
app.delete('/v1/search', function(req, res){
  var url = 'http://' + config.mlhost + ':' + config.mlport +
          '/v1/search?' + buildQuery(req);
  request({
    method: "DELETE",
    url: url,
    auth: auth
  }, function (error, response, body) {
    if (response) {
      if ((response.statusCode >= 200) && (response.statusCode < 300)) {
        res.send(response); // Note: body is empty on success
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

// Put a document: /v1/documents PUT
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
        res.send(response); // Note: body is empty on success
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

var deleteOne = function (uri, callback) {
  var url = 'http://' + config.mlhost + ':' + config.mlport +
          '/v1/documents?uri=' + uri;
  request({
    method: "DELETE",
    url: url,
    auth: auth
  }, function (error, response, body) {
    if (response) {
      if ((response.statusCode >= 200) && (response.statusCode < 300)) {
        console.log('deleteOne success: ' + url);
        //res.send(response); // Note: body is empty on success
        if (callback) {
          callback();
        }
      } else {
        console.log('Error: '+ response.statusCode);
        console.log(body);
        //res.status(response.statusCode).send();
      }
    } else {
    console.log('Error: No response object');
  }
  });
}

var getAllThings = function (callback) {
  var url = 'http://' + config.mlhost + ':' + config.mlport + '/v1/search';
      url += '?format=json&options=argame';
      url += '&directory=/things/&pageLength=999';// + config.numThings;
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
        //res.set('Content-Type', 'application/json');
        console.log('getAllThings success: ' + JSON.parse(body).total);
        //res.send(JSON.parse(body));
        if (callback) {
          callback(JSON.parse(body));
        }
      } else {
        console.log('Error: '+ response.statusCode);
        console.log(body);
        //res.status(response.statusCode).send();
      }
    } else {
      console.log('Error: No response object');
    }
  });
}

// Get expired things: is current > exp date?
var getExpThings = function (current, callback) {
  var url = 'http://' + config.mlhost + ':' + config.mlport + '/v1/search';
      url += '?q=exp LT ' + current + '&format=json&options=argame';
      url += '&directory=/things/&pageLength=999';// + config.numThings;
  console.log('getExpThings url: ' + url);
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
        //res.set('Content-Type', 'application/json');
        console.log('getExpThings success: ' + JSON.parse(body).total);
        //res.send(JSON.parse(body));
        if (callback) {
          callback(JSON.parse(body));
        }
      } else {
        console.log('Error: '+ response.statusCode);
        console.log(body);
        //res.status(response.statusCode).send();
      }
    } else {
      console.log('Error: No response object');
    }
  });
}

var io = require('socket.io').listen(app.listen(config.port));
console.log('Express started on port ' + config.port);
io.sockets.on('connection', function (socket) {
  console.log('connection established');
  socket.on('thingDeleted', function (data) {
    io.sockets.emit('thingDeleted', data);
  });
});

var User = require('./src/scripts/User');

setInterval(function () {
  var current = Math.floor(new Date() / 1000);
  console.log('current: ' + current);
  getExpThings(current, function (data) {
    console.log('getExpThings: ' + data.total);
    // To store IDs for things that have expired and need deletion
    var deletedArr = [];
    for (var i = 0; i < data.results.length; i++) {
      console.log(data.results[i].uri + ' has expired: ' +
                  data.results[i].metadata[5].exp);
      // Delete things one at a time
      deleteOne(data.results[i].uri);
      var id = data.results[i].uri
               .slice(0, data.results[i].uri.length - 5)
               .substring(8);
      // Extract thing ID because that's what we need to emit
      deletedArr.push(id);
    }
    // Emit all the IDs to players all at once as array
    io.sockets.emit('thingDeleted', { ids: deletedArr });
  });
}, 10000);

