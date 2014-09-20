var config = {
  // Node.js server
  port:  '8066',  // Users access your app here
  // MarkLogic server
  mlversion: '8',
  mlhost:    'localhost',
  mlport:    '8077', // Your app accesses MarkLogic here
  mladminuser:    'REST-ADMIN-USER',
  mladminpass:    'REST-ADMIN-PASSWORD'
  mluser:    'REST-WRITER-USER',
  mlpass:    'REST-WRITER-PASSWORD'
};

module.exports = config;
