var config = require('./config');

var Twitter = require('simple-twitter');
var main = makeTwitter(config.twitter);
var red = makeTwitter(config.red);
var green = makeTwitter(config.green);
var orange = makeTwitter(config.orange);
var blue = makeTwitter(config.blue);
var boat = makeTwitter(config.boat);
var bus = makeTwitter(config.bus);
var fitchburg = makeTwitter(config.fitchburg);
var framingham = makeTwitter(config.framingham);
var newburyport = makeTwitter(config.newburyport);
var providence = makeTwitter(config.providence);
var mattapan = makeTwitter(config.mattapan);
var bus8 = makeTwitter(config.bus8);
var bus22x = makeTwitter(config.bus22x);
function makeTwitter(config) {
  return new Twitter(config.consumerKey, config.consumerSecret, config.token, config.tokenSecret);
}
module.exports = tweet;
function tweet(alert, cb) {
  var msg = alert.header_text;
  console.log(alert.affected_services);
  if (typeof cb === 'undefined') {
    cb = defaultCallback;
  }
  other(alert, cb);
  return main.post('statuses/update', {
    status: cleanForTweet(msg)
  }, cb);
}
function other(alert, cb) {
  var msg = cleanForTweet(alert.header_text);
  console.log('tweeting ', msg);
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Red Line';
  })) {
    red.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Green Line';
  })) {
    green.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Orange Line';
  })) {
    orange.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Blue Line';
  })) {
    blue.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Fitchburg/South Acton Line';
  })) {
    fitchburg.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Framingham/Worcester Line';
  })) {
    framingham.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Providence/Stoughton Line';
  })) {
    providence.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Newburyport/Rockport Line';
  })) {
    newburyport.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.route_name ==='Mattapan High-Speed Line' || service.route_name === 'Mattapan Trolley';
  })) {
    mattapan.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.mode_name ==='Boat';
  })) {
    boat.post('statuses/update', {
      status: msg
    }, cb);
  }
  if (alert.affected_services.services.some(function (service) {
    return service.mode_name ==='Bus';
  })) {
    bus.post('statuses/update', {
      status: msg
    }, cb);
    if (alert.affected_services.services.some(function (service) {
      return service.route_name ==='8';
    })) {
      bus8.post('statuses/update', {
        status: msg
      }, cb);
    }
    if (alert.affected_services.services.some(function (service) {
      return service.route_name ==='220' || service.route_name ==='221' || service.route_name ==='222';
    })) {
      bus22x.post('statuses/update', {
        status: msg
      }, cb);
    }
  }
}
function defaultCallback(err) {
  if (err) {
    return console.log(err);
  }
}

function cleanForTweet(msg) {
  if (msg.length > 131) {
    msg = msg.slice(0, 131) + '...';
  }
  msg = msg + ' #mbta';
  msg= msg.replace(/\b\w+?\b [Ll]ine/g, function(a) {
    return '#' + a.replace(/\ /, "");
  });
  return  msg;
}