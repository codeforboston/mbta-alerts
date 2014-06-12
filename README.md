MBTA Alerts
===========

### The Bot That Tweets

The MBTA puts out an RSS feed that an enterprising developer (or frustrated MBTA commuter) started scraping and turning into tweets.

This app scrapes the [MBTA's readtime feed feed](http://realtime.mbta.com/portal), and will tweet out the short descriptions, with the hashtag #[mbta](https://twitter.com/search?q=%23mbta&src=typd).


### The Story

[FredHQ][fredhq], the creator of [@mbta_alerts][alerts], [almost suspended][almost] the account due to a number of obstacles, but Code for Boston offered to take it over. Fred provided [thorough documentation of his processes][prodoc], which led to the development of this app.

[fredhq]: https://twitter.com/fredhq
[alerts]: https://twitter.com/mbta_alerts
[almost]: https://gist.github.com/fredhq/34781ea7c60c1388e16e
[prodoc]: https://gist.github.com/fredhq/eaf7a6ebb1ac88c6cc69

Then for the 2014 national day of civic hacking [Calvin Metcalf][] creatted a whole slew of single line accounts on top of the origional one.

- [Green Line Alerts](https://twitter.com/greenlinealerts/)
- [Red Line Alerts](https://twitter.com/Red_Line_Alerts)
- [Fitchburg/South Acton Line Alerts](https://twitter.com/fitchburgalerts)
- [Orange Line Alerts](https://twitter.com/OrangeLineAlert)
- [Framingham/Worcester Line Alerts](https://twitter.com/framinghamline)
- [Newburyport/Rockport Line Alerts](https://twitter.com/NewburyportLine)
- [Providence/Stoughton Line Alerts](https://twitter.com/providenceline)
- [Blue Line Alerts](https://twitter.com/BlueLineAlerts)
- [Haverhill Line Alerts](https://twitter.com/haverhillline)
- [Franklin Line Alerts](https://twitter.com/franklinalerts)
- [8 Bus Alerts](https://twitter.com/8_bus)
- [Lowell Line Alerts](https://twitter.com/lowellline)
- [60 Bus Alerts](https://twitter.com/60_bus)
- [Commuter Boat Alerts](https://twitter.com/mbtaboatalerts)
- [Mattapan High Speed Line](https://twitter.com/highspeedalerts)
- [Buses 220, 221, 222 alerts](https://twitter.com/220_222)
- [MBTA Bus Alerts](https://twitter.com/mbta_bus_alerts)
- [Eastie MBTA Alerts](https://twitter.com/EastieMBTA)
- [Melrose MBTA Alerts](https://twitter.com/melrosembta)
- [Salem MBTA Alerts](https://twitter.com/SalemMBTA)
- [Saugus MBTA Alerts](https://twitter.com/SaugusMBTA)

[Calvin Metcalf]: https://github.com/calvinmetcalf

### Tech stack

MBTA Alerts uses:

+ nodejs
+ couchdb
+ [pouchdb](https://github.com/pouchdb/pouchdb)
+ last pass
