MBTA Alerts
===========

### The Bot That Tweets

The MBTA puts out an RSS feed that an enterprising developer (or frustrated MBTA commuter) started scraping and turning into tweets.

This app scrapes the [MBTA's new RSS feed](http://realtime.mbta.com/alertsrss/rssfeed4), and will tweet out the short descriptions, with the hashtag #[mbta](https://twitter.com/search?q=%23mbta&src=typd).


### The Story

[FredHQ][fredhq], the creator of [@mbta_alerts][alerts], [almost suspended][almost] the account due to a number of obstacles, but Code for Boston offered to take it over. Fred provided [thorough documentation of his processes][prodoc], which led to the development of this app.

[fredhq]: https://twitter.com/fredhq
[alerts]: https://twitter.com/mbta_alerts
[almost]: https://gist.github.com/fredhq/34781ea7c60c1388e16e
[prodoc]: https://gist.github.com/fredhq/eaf7a6ebb1ac88c6cc69

The old RSS feed used short descriptions which were tweetable, but upgrades to the [current feed](http://realtime.mbta.com/alertsrss/rssfeed4) caused technical problems for the bot.

### Tech stack

MBTA Alerts uses:

+ Ruby 2.0
+ [Sinatra][sin] as a framework
+ [Redis][red] as a database
+ [Resque][res] and [resque-scheduler][sch] as background job coordinators

[sin]: www.sinatrarb.com
[red]: http://redis.io/
[res]: https://github.com/defunkt/resque
[sch]: https://github.com/bvandenbos/resque-scheduler



### Getting Set Up for Development

Make sure you have `rvm`, Ruby >= 2.0.0, and `git`. If you don't have `rvm` and you're on a Mac, [install Homebrew](http://mxcl.github.io/homebrew/).

Use a distinct gemset for MBTA Alerts and `bundle install` the gems.

```
$ rvm gemset create talerts
$ rvm gemset use talerts
$ bundle install
```

To determine if you have Redis, run `redis-server -v`.

Install redis if you have not done so previously.

```
$ wget http://redis.googlecode.com/files/redis-2.6.13.tar.gz
$ tar xzf redis-2.6.13.tar.gz
$ cd redis-2.6.13
$ make
```


### Notes

Some of the challenges mentioned by FredHQ in his gists solve themselves with the new MBTA feed structure (version 4). For example:

+ There is a GUID tag that we can use in Redis to determine whether a tweet has already been sent.

