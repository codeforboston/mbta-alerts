var config = require('./config');

var Twitter = require('simple-twitter');
var bots = [
  {
    config: config.twitter,
    test: function () {
      return true;
    },
    name: 'main'
  },
  {
    config:config.red,
    test:function (service) {
      return service.route_name ==='Red Line';
    },
    name: 'red'
  },
  {
    config:config.green,
    test:function (service) {
      return service.route_name ==='Green Line';
    },
    name: 'green'
  },
  {
    config:config.orange,
    test:function (service) {
      return service.route_name ==='Orange Line';
    },
    name: 'orange'
  },
  {
    config:config.blue,
    test:function (service) {
      return service.route_name ==='Blue Line';
    },
    name: 'blue'
  },
  {
    config:config.boat,
    test:function (service) {
      return service.mode_name ==='Boat';
    },
    name: 'boat'
  },
  {
    config:config.bus,
    test:function (service) {
      return service.mode_name ==='Bus';
    },
    name: 'bus'
  },
  {
    config:config.fitchburg,
    test:function (service) {
      return service.route_name ==='Fitchburg/South Acton Line';
    },
    name: 'fitchburg'
  },
  {
    config:config.framingham,
    test:function (service) {
      return service.route_name ==='Framingham/Worcester Line';
    },
    name: 'framingham'
  },
  {
    config:config.newburyport,
    test:function (service) {
      return service.route_name ==='Newburyport/Rockport Line';
    },
    name: 'newburyport'
  },
  {
    config:config.haverhill,
    test:function (service) {
      return service.route_name ==='Haverhill Line';
    },
    name: 'haverhill'
  },
  {
    config:config.franklin,
    test:function (service) {
      return service.route_name ==='Franklin Line';
    },
    name: 'franklin'
  },
  {
    config:config.providence,
    test:function (service) {
      return service.route_name ==='Providence/Stoughton Line';
    },
    name: 'providence'
  },
  {
    config:config.lowell,
    test:function (service) {
      return service.route_name === 'Lowell Line';
    },
    name: 'lowell'
  },
  {
    config:config.mattapan,
    test:function (service) {
      return service.route_name ==='Mattapan High-Speed Line' || service.route_name === 'Mattapan Trolley';
    },
    name: 'mattapan'
  },
  {
    config:config.bus8,
    test:function (service) {
      return service.route_name ==='8';
    },
    name: 'bus8'
  },
  {
    config:config.bus60,
    test:function (service) {
      return service.route_name ==='60';
    },
    name: 'bus8'
  },
  {
    config:config.bus22x,
    test:function (service) {
      return service.route_name ==='220' || service.route_name ==='221' || service.route_name ==='222';
    },
    name: 'bus22x'
  },
  {
    config:config.eastie,
    test: function (service) {
      return ~['114', '116', '117', '119', '120', '121', 'Blue Line'].indexOf(service.route_name);
    },
    name: 'eastie'
  },
  {
    config:config.melrose,
    test: function (service) {
      return ~['106', '131', '132', '136', '137', 'Haverhill Line'].indexOf(service.route_name);
    },
    name: 'melrose'
  },
  {
    config:config.salem,
    test: function (service) {
      return ~['450', '451', '455', '456', '459','465', '468','Newburyport/Rockport Line'].indexOf(service.route_name);
    },
    name: 'salem'
  },
  {
    config:config.saugus,
    test: function (service) {
      return ~['426', '428', '429', '430'].indexOf(service.route_name);
    },
    name: 'saugus'
  }
].map(function (thing) {
  thing.bot = makeTwitter(thing.config);
  return thing;
});
function makeTwitter(config) {
  return new Twitter(config.consumerKey, config.consumerSecret, config.token, config.tokenSecret);
}
module.exports = tweet;
function tweet(alert) {
  var msg = alert.header_text;
  console.log(alert.affected_services);
  other(alert, defaultCallback);
}
function other(alert, cb) {
  var msg = cleanForTweet(alert.header_text);
  //console.log('tweeting ', msg);
  bots.forEach(function (bot) {
    if (alert.affected_services.services.some(bot.test)) {
      bot.bot.post('statuses/update', {
        status: msg
      }, cb);
      console.log(bot.name, 'is tweeting', msg);
    }
  });
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