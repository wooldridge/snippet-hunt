var config = {
  // Node.js server
  port:  '8055',  // Users access your app here
  // MarkLogic server
  mlversion: '8',
  mlhost:    'localhost',
  mlport:    '8077', // Your app accesses MarkLogic here
  mluser:    'REST-WRITER-USER',
  mlpass:    'REST-WRITER-PASSWORD'
};

module.exports = config;
