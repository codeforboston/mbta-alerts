var request = require('request');

var Twitter = require('simple-twitter');

var config = require('./config');

var crypto = require('crypto');

var twitter = new Twitter(config.twitter.consumerKey, config.twitter.consumerSecret, config.twitter.token, config.twitter.tokenSecret);

var params = {
  qs: {
    api_key: config.key
  },
  url: 'http://realtime.mbta.com/developer/api/v1/alerts',
  json: true
};

function defaultCallback(err) {
  if (err) {
    return console.log(err);
  }
};

function cleanForTweet(msg) {
  if (msg.length > 131) {
    msg = msg.slice(0, 131) + '...';
  }
  msg = msg + ' #mbta';
  msg= msg.replace(/\b\w+?\b [Ll]ine/g, function(a) {
    return '#' + a.replace(/\ /, "");
  });
  console.log('tweeting ', msg);
  return  msg;
};

function tweet(msg, cb) {
  if (cb == null) {
    cb = defaultCallback;
  }
  return twitter.post('statuses/update', {
    status: cleanForTweet(msg)
  }, cb);
};

function filterEl(headerText) {
  return /elevator/.test(headerText.toLowerCase()) || /escalator/.test(headerText.toLowerCase());
};

function eachAlert(v) {
  var nParams;
  if (filterEl(v.header_text)) {
    return;
  }
  v['_id'] = v['alert_id'].toString();
  nParams = {
    url: "https://" + config.couch.user + ":" + config.couch.pw + "@" + config.couch.server + "/" + config.couch.db + "/" + v._id,
    json: true
  };
  request(nParams, function(e, r, b) {
    var callback;
    if (e) {
      console.log(e);
    } else if (r.statusCode === 200) {
      v._rev = b._rev;
      callback = defaultCallback;
    } else {
      callback = function(e, r, b) {
        if (r.statusCode === 201) {
          return tweet(v.header_text);
        }
      };
    }
    nParams.method = 'put';
    nParams.body = v;
    request(nParams, callback);
    return true;
  });
  return true;
};

lastHash = false;

function dumbCache(alerts, cb) {
  var hash, newHash;
  hash = crypto.createHash('sha512');
  hash.update(JSON.stringify(alerts), 'utf8');
  newHash = hash.digest('base64');
  if (lastHash === newHash) {
    console.log('no change');
  } else {
    lastHash = newHash;
    cb(alerts);
  }
  return true;
};

i = 0;

function start() {
  console.log('run number #', ++i);
  request(params, function(e, r, b) {
    if (b && b.alerts) {
      dumbCache(b.alerts, function(alerts) {
        return alerts.forEach(eachAlert);
      });
    } else {
      console.log(e, r, b);
    }
    return true;
  });
  return true;
};

start();

setInterval(start, 60000);
