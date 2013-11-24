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

+ nodejs



### Getting Set Up for Development

```bash
npm install
./server.js
```

done
