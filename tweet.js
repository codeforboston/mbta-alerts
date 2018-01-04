var config = require('./config');
var colors = require('colors');
var Twitter = require('simple-twitter');
var bots = (config.dev ? [{
  config: config.twitter,
  test: function () {
    return true;
  },
  name: 'dev'
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
      return service.route ==='Red';
    },
    name: 'red'
  },
  {
    config:config.green,
    test:function (service) {
      return service.route.length > 5 && service.route.slice(0, 5) ==='Green';
    },
    name: 'green'
  },
  {
    config:config.orange,
    test:function (service) {
      return service.route ==='Orange';
    },
    name: 'orange'
  },
  {
    config:config.blue,
    test:function (service) {
      return service.route ==='Blue';
    },
    name: 'blue'
  },
  {
    config:config.boat,
    test:function (service) {
      return service.route_type === 4;
    },
    name: 'boat'
  },
  {
    config:config.bus,
    test:function (service) {
      return service.route_type === 3;
    },
    name: 'bus'
  },
  {
    config:config.fitchburg,
    test:function (service) {
      return service.route ==='CR-Fitchburg';
    },
    name: 'fitchburg'
  },
  {
    config:config.framingham,
    test:function (service) {
      return service.route ==='CR-Worcester';
    },
    name: 'framingham'
  },
  {
    config:config.newburyport,
    test:function (service) {
      return service.route ==='CR-Newburyport';
    },
    name: 'newburyport'
  },
  {
    config:config.haverhill,
    test:function (service) {
      return service.route ==='CR-Haverhill';
    },
    name: 'haverhill'
  },
  {
    config:config.franklin,
    test:function (service) {
      return service.route ==='CR-Franklin';
    },
    name: 'franklin'
  },
  {
    config:config.providence,
    test:function (service) {
      return service.route ==='CR-Providence';
    },
    name: 'providence'
  },
  {
    config:config.lowell,
    test:function (service) {
      return service.route === 'CR-Lowell';
    },
    name: 'lowell'
  },
  {
    config:config.mattapan,
    test:function (service) {
      return service.route ==='Mattapan';
    },
    name: 'mattapan'
  },
  {
    config:config.bus8,
    test:function (service) {
      return service.route ==='8';
    },
    name: 'bus8'
  },
  {
    config:config.bus60,
    test:function (service) {
      return service.route ==='60';
    },
    name: 'bus8'
  },
  {
    config:config.bus22x,
    test:function (service) {
      return service.route ==='220' || service.route ==='221' || service.route ==='222';
    },
    name: 'bus22x'
  },
  {
    config:config.eastie,
    test: function (service) {
      return ~['114', '116', '117', '119', '120', '121', 'Blue'].indexOf(service.route);
    },
    name: 'eastie'
  },
  {
    config:config.melrose,
    test: function (service) {
      return ~['106', '131', '132', '136', '137', 'CR-Haverhill'].indexOf(service.route);
    },
    name: 'melrose'
  },
  {
    config:config.salem,
    test: function (service) {
      return ~['450', '451', '455', '456', '459','465', '468', 'CR-Newburyport'].indexOf(service.route);
    },
    name: 'salem'
  },
  {
    config:config.saugus,
    test: function (service) {
      return ~['426', '428', '429', '430'].indexOf(service.route);
    },
    name: 'saugus'
  },
  {
    config:config.quincy,
    test: function (service) {
      return  service.route_type === 4 || ~[
        'Red',
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
        'CR-Middleborough',
        'CR-Kingston',
        'CR-Greenbush'
      ].indexOf(service.route);
    },
    name: 'quincy'
  },
  {
    config:config.southie,
    test: function (service) {
      return ~['Red', '5', '7', '9', '10', '11'].indexOf(service.route);
    },
    name: 'southie'
  },
  {
    config:config.greenbush,
    test: function(service) {
      return service.route ==='CR-Greenbush';
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
    if (alert.informed_entity.some(bot.test)) {
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
