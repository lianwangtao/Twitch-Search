// Allows use of ES6 features
require('babel-register')({
  presets: ['latest']
});

// Run the ES6 server code
require('./server.babel');
