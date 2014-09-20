var config = {
  // Node.js server
  port:  '8066',  // Users access your app here
  // MarkLogic server
  mlversion: '8',
  mlhost:    'localhost',
  mlport:    '8077', // Your app accesses MarkLogic here
  mluser:    'REST-ADMIN-USER',
  mlpass:    'REST-ADMIN-PASSWORD'
};

module.exports = config;
