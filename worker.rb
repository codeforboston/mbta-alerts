# Tweeter
# Worker job that gets alerts, compares them, saves & tweets new ones

class AlertUsher
  # Saves new alerts into Redis in their current form

  @url = "http://realtime.mbta.com/alertsrss/rssfeed4"
  @feed = RSS::Parser.parse( open(@url) )

  @feed.items.each do |alert|
    unless Alert.find(alert.guid) # TODO: Write Alert#find
      new_alert = Alert.new(id: alert.guid, message: alert.title)
      new_alert.link = alert.link if alert.link
      new_alert.save
    end
  end

end


class AlertTweeter
  include TweetHelpers

  # Run through list of untweeted alerts, tweetify, and tweet them
  untweeted_ids = []  # TODO 
  puts "redis.lrange untweeted 0 -1"
  
  untweeted_ids.each do |id|
    tweetable_content = redis.hgetall "alerts:#{id}"
    to_tweet = tweetify(tweetable_content)
    # TODO: Tweet the tweet
  end

end