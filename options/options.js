var request = require('request'),
    config = require('../config'),

    optName = 'argame', // Default search-options set name

    keys = [
        //'foo',
        //'bar'
    ];

meta = [
  'id',
  'type',
  'name',
  'lat',
  'lon',
  'value',
  'zIndex',
  'username',
  'score'
];

// Get the optional search-options set name
if (process.argv[2]) {
  optName = process.argv[2];
}

// Set up options container
var options = {
  'options': {
    'constraint': [],
    'extract-metadata': {
      'constraint-value': []
    }
  }
}

var mlversion = config.mlversion.substring(0,1);
var jsonkey = (mlversion === '7') ? 'json-key' : 'json-property';
options.options['extract-metadata'][jsonkey] = [];
console.log(jsonkey);
console.log(options);

// Add JSON key constraints
// for (var k=0; k<keys.length; k++) {
//   var constr = { 'name': keys[k], 'word': { 'json-property': keys[k] } };
//   options.options.constraint.push(constr);
// }

// Add extract-metadata settings
for (var m=0; m<meta.length; m++) {
  //options.options['extract-metadata']['json-property'].push(meta[m]);
  options.options['extract-metadata'][jsonkey].push(meta[m]);
}

// Define 'language' range constraint
// var constr = { 'name': 'language',
//   'range': {
//     'collation': 'http://marklogic.com/collation/',
//     'type': 'xs:string',
//     'facet': true,
//     'facet-option': [
//       'frequency-order',
//       'descending'
//     ],
//     'element': {
//       'ns': 'http://marklogic.com/xdmp/json/basic',
//       'name': 'language'
//     }
//   }
// };
// Add 'language' range constraint
// options.options.constraint.push(constr);
// Add 'language' extract-metadata setting
// options.options['extract-metadata']['constraint-value'].push({ 'ref': 'language'});

// Define 'watchers' range constraint
// var constr = { 'name': 'watchers',
//   'range': {
//     'type': 'xs:int',
//     'bucket': [
//       {
//         "name": "0",
//         "lt": "1",
//         "label": "0"
//       },
//       {
//         "name": "1",
//         "ge": "1",
//         "lt": "10",
//         "label": "1 to 9"
//       },
//       {
//         "name": "10",
//         "ge": "10",
//         "lt": "100",
//         "label": "10 to 99"
//       },
//       {
//          "name": "100",
//          "ge": "100",
//          "lt": "1000",
//          "label": "100 to 999"
//       },
//       {
//           "name": "1000",
//           "ge": "1000",
//           "lt": "10000",
//           "label": "1,000 to 9,999"
//       },
//       {
//           "name": "10000",
//           "ge": "10000",
//           "label": ">10,000"
//       }
//     ],
//     'facet': true,
//     'facet-option': [
//       'item-order',
//       'ascending'
//     ],
//     'element': {
//       'ns': 'http://marklogic.com/xdmp/json/basic',
//       'name': 'watchers'
//     }
//   }
// };
// Add 'watchers' range constraint
// options.options.constraint.push(constr);
// Add 'watchers' extract-metadata setting
// options.options['extract-metadata']['constraint-value'].push({ 'ref': 'watchers'});

// Log to console for debugging
console.log(JSON.stringify(options));

// Send options PUT
var putOptions = function () {
  request({
    method: 'PUT',
    url: 'http://' + config.mlhost + ':' + config.mlport + '/v1/config/query/' + optName,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options),
    auth: {
      user: config.mluser,
      pass: config.mlpass,
      sendImmediately: false
    }
  }, function (error, response, body) {
    if (response) {
      if ((response.statusCode >= 200) && (response.statusCode < 300)) {
        console.log(response.statusCode);
      } else {
        console.log('Error: '+ response.statusCode);
        console.log(body);
      }
    } else {
      console.log('Error: No response object');
    }
  });
}

// Start processing
putOptions();
