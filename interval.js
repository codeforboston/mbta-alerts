var bot = require('./bot');
var interval = require('interval');
var config = require('./config');
var stringify = require('json-stable-stringify');
var PouchDB = require('pouchdb');
var dbremote = new PouchDB("https://" + config.couch.user + ":" + config.couch.pw + "@" + config.couch.server + "/" + config.couch.db);
var db = new PouchDB('./local');
var sync = db.sync(dbremote);
sync.on('change', function (ch) {
  console.log(JSON.stringify(ch, false, 4));
});
sync.on('complete', function () {
  db.replicate.to(dbremote, {live: true});
  console.log('starting');
  setInterval(interfunc, interval({seconds: 10}));
  interfunc();
});
sync.on('error', function (e) {
  console.log(e);
  process.exit(5);
});


var i = 0;
function interfunc() {
  console.log('run number #', ++i);
  bot();
}
process.on('exit', function (e) {
  console.log('exiting', e);
});
