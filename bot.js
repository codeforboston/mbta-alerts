var request = require('request');
var config = require('./config');
var crypto = require('crypto');
var tweet = require('./tweet');
var stringify = require('json-stable-stringify');
var PouchDB = require('pouchdb');
var Promise = require('bluebird');
var db = new PouchDB('./local');
var params = {
  qs: {
    api_key: config.key
  },
  url: 'http://realtime.mbta.com/developer/api/v2/alerts',
  json: true
};

function defaultCallback(err) {
  if (err) {
    return console.log(err);
  }
}



function filterEl(headerText) {
  return /elevator/.test(headerText.toLowerCase()) || /escalator/.test(headerText.toLowerCase());
}

function eachAlert(alert) {
  var nParams;
  if (filterEl(alert.header_text)) {
    return;
  }
  alert._id = alert.alert_id.toString();
  var newAlert = false;
  return db.get(alert._id).then(function (doc) {
    alert._rev = doc._rev;
    if(stringify(alert) !== stringify(doc)) {
      return alert;
    }
  }, function (e) {
    if (e.message === 'deleted') {
      return db.allDocs({keys:[alert._id]}).then(function (a){
        alert._rev = a.rows[0].value.rev;
        return alert;
      });
    } else {
      newAlert = true;
      return alert;
    }
  }).then(function (alert) {
    if (alert) {
      return db.put(alert);
    }
  }).then(function (resp) {
    if (newAlert) {
      tweet(alert);
    }
  });
}

var lastHash = false;
function makeHash(obj) {
  var hash = crypto.createHash('sha512');
  hash.update(stringify(obj));
  return hash.digest('base64');
}
function dumbCache(alerts) {
  var newHash = makeHash(alerts);
  if (lastHash === newHash) {
    //console.log('no change');
    return false;
  } else {
    lastHash = newHash;
    return true;
  }
}

function start() {
  request(params, function(e, r, b) {
     if(e) {
      lastHash = false;
      console.log(e.stack);
      console.log(e);
      process.exit(1);
    } else if (b && b.alerts) {
      if (dumbCache(b.alerts)) {
        return Promise.all(b.alerts.map(eachAlert)).then(function () {
           process.send({
            ok: true
          });
        }).catch(function (e) {
          console.log(e.stack);
          console.log(e);
          process.exit(1);
        });
      }
      process.send({
        ok: true
      });
      return;
    }
  });
}

module.exports = start;