#!/bin/env node

var cluster = require('cluster');

if (cluster.isMaster) {
  // Fork workers.

    cluster.fork();
  

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    cluster.fork();
  });
} else {
  require('./bot');
}
