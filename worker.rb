# Tweeter
# Worker job that gets alerts, compares them, saves & tweets new ones

class AlertUsher
  # Saves new alerts into Redis in their current form

  @url = "http://realtime.mbta.com/alertsrss/rssfeed4"
  @feed = RSS::Parser.parse( open(@url) )

  @feed.items.each do |alert|
    # Before adding to redis, does it already exist?
    unless Alert.hmget alert.guid
      new_alert = Alert.new(id: alert.guid, message: alert.title)
      new_alert.link = alert.link if alert.link
      new_alert.save
    end
  end

end


class AlertTweeter
  include TweetHelpers

  # Run through list of untweeted alerts, tweetify, and tweet them
  untweeted_ids = redis.smembers 'untweeted'
  
  untweeted_ids.each do |id|
    alert_content = redis.hgetall "alerts:#{id}"
    tweetable_alert = tweetify alert_content
    puts tweetable_alert
    # send_tweet tweetable_alert
  end

end