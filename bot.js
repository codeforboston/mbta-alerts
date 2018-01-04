var request = require('request');
var config = require('./config');
var crypto = require('crypto');
var tweet = require('./tweet');
var stringify = require('json-stable-stringify');
var PouchDB = require('pouchdb');
var Promise = require('bluebird');
var db = new PouchDB('./local');
var newUrl = 'https://api-v3.mbta.com/alerts';


// var params = {
//   qs: {
//     api_key: config.key
//   },
//   url: 'http://realtime.mbta.com/developer/api/v2/alerts',
//   json: true
// };
var params = {
  headers: {},
  url: newUrl,
  json: true
};
if (config.newkey) {
  params.qs = {
    api_key:config.newkey
  }
}
// function defaultCallback(err) {
//   if (err) {
//     return console.log(err);
//   }
// }



// function filterEl(headerText) {
//   return /elevator/.test(headerText.toLowerCase()) || /escalator/.test(headerText.toLowerCase());
// }
function cleanForTweet(msg) {
  msg = msg.replace(/\b\w+?\b [Ll]ine/g, function(a) {
    return '#' + a.replace(/\ /g, '');
  });
  var maxSize = 271;
  if (msg.search('mbta.com') > -1) {
    maxSize -= 23;
  }
  if (msg.length > maxSize) {
    if (msg.length - 9 > maxSize) {
      msg = msg.slice(0, maxSize) + '...';
    }
  }
  if (msg.length + 5 < maxSize) {
    msg = msg + ' #mbta';
  }
  return  msg;
}

function eachAlert(_alert) {
  var alert = _alert.attributes;
  alert.alert_id = _alert.id;
  if (alert.effect === 'ACCESS_ISSUE' || alert.effect === 'STATION_ISSUE') {
    return;
  }
  alert.tweeted_msg = cleanForTweet(alert.short_header || alert.header)
  alert._id = crypto.createHmac('sha256', alert.alert_id).update(alert.tweeted_msg).digest('hex');
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
    // console.log('no change');
    return false;
  } else {
    lastHash = newHash;
    return true;
  }
}

function start() {
  // console.log(params);
  request(params, function(e, r, b) {
    if (e) {
      lastHash = false;
      console.log(e.stack);
      console.log(e);
      process.exit(1);
    } else if (r.statusCode === 304) {
      process.send({
        ok: true
      });
      return;
    } else if (b && b.data) {
      if (r.headers.etag) {
        params.headers['If-None-Match'] = r.headers.etag;
      } else {
        delete params.headers['If-None-Match'];
      }
      if (r.headers['last-modified']) {
        params.headers['If-Modified-Since'] = r.headers['last-modified'];
      } else if (r.headers.date) {
        params.headers['If-Modified-Since'] = r.headers.date;
      } else {
        delete params.headers['If-Modified-Since'];
      }
      if (dumbCache(b.data)) {
        return Promise.all(b.data.map(eachAlert)).then(function () {
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
