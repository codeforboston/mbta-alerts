var bot = require('./bot');
var interval = require('interval');
var config = require('./config');
var stringify = require('json-stable-stringify');
var PouchDB = require('pouchdb');
var dbremote = new PouchDB("https://" + config.couch.user + ":" + config.couch.pw + "@" + config.couch.server + "/" + config.couch.db);
var db = new PouchDB('./local');
db.sync(dbremote).then(function () {
  db.replicate.to(dbremote, {live: true});
  setInterval(interfunc, interval({seconds: 10}));
  interfunc();
});



var i = 0;
  function interfunc() {
    console.log('run number #', ++i);
    bot();
  }