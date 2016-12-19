var config = require('./config');
var colors = require('colors');
var Twitter = require('simple-twitter');
var bots = (config.dev ? [{
  config: config.twitter,
  test: function () {
    return true;
  },
  name: 'main'
}] : [
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
      return service.route_name.length > 10 && service.route_name.slice(0, 10) ==='Green Line';
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
      return service.route_name ==='Fitchburg Line' || service.route_name ==='Fitchburg/South Acton Line';
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
  },
  {
    config:config.quincy,
    test: function (service) {
      return service.mode_name ==='Boat' || ~[
        'Red Line',
        '201',
        '202',
        '210',
        '211',
        '212',
        '214',
        '215',
        '216',
        '217',
        '220',
        '221',
        '222',
        '225',
        '230',
        '236',
        '238',
        '240',
        '245',
        'Middleborough/Lakeville Line',
        'Kingston/Plymouth Line',
        'Greenbush Line'
      ].indexOf(service.route_name);
    },
    name: 'quincy'
  },
  {
    config:config.southie,
    test: function (service) {
      return ~['Red Line', '5', '7', '9', '10', '11'].indexOf(service.route_name);
    },
    name: 'southie'
  },
  {
    config:config.greenbush,
    test: function(service) {
      return service.route_name ==='Greenbush Line';
    },
    name: 'greenbush'
  }
]).map(function (thing) {
  thing.bot = makeTwitter(thing.config);
  return thing;
});
function makeTwitter(config) {
  return new Twitter(config.consumerKey, config.consumerSecret, config.token, config.tokenSecret);
}
module.exports = tweet;

function tweet(alert) {
  var msg = alert.tweeted_msg;
  //console.log('tweeting ', msg);
  bots.forEach(function (bot) {
    if (alert.affected_services.services.some(bot.test)) {
      bot.bot.post('statuses/update', {
        status: msg
      }, function (err) {
        if (err) {
          console.log(err);
          console.log(bot.name.cyan, 'errored with', msg.red);
          var errData = err.data;
          try {
            var parsedErrorData = JSON.parse(errData);
            if (parsedErrorData.errors.length) {
              var code = parsedErrorData.errors[0].code;
              if (code === 186 || code === 187) {
                return;
              }
            }
          } catch (e) {
            console.log(e);
          }
          process.exit(3);
          //process.exit(3);
        }
      });
      console.log(bot.name.cyan, 'is tweeting', msg.red);
    }
  });
}
