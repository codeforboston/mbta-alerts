'use strict';
var cp = require('child_process');
var child;
var defaultTimeout = 50;
var timeout = 0;
function spawnChild(e) {
  if (e) {
    console.log(e);
  }
  console.log(new Date());
  console.log('spawning');
  if (timeout === 0) {
    child = cp.fork( __dirname + '/interval.js').once('exit', spawnChild);
    timeout = 50;
  } else {
    setTimeout(function () {
      child = cp.fork( __dirname + '/interval.js').once('message', function () {
        timeout = defaultTimeout;
      }).once('exit', spawnChild);
    }, timeout);
    timeout <<= 1;
  }
}
process.on('exit', function (e) {
  child.kill('SIGINT');
  console.log(new Date());
  console.log('exiting with code: ', e);
});
spawnChild();