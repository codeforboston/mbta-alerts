require "bundler/setup"
require './app'
require './models/alert'
require './helpers/tweet_helpers'

Bundler.require(:default)


class AlertUsher
  # Saves new alerts into Redis in their current form
  @queue = :usher_queue

  FEED_URL = "http://realtime.mbta.com/alertsrss/rssfeed4"

  def self.perform  
    @feed = RSS::Parser.parse( open FEED_URL )

    @feed.items.each do |alert|
      # Before adding to redis, does it already exist?
      @guid = alert.guid.content.gsub 'T-Alert ID ', ''

      puts "Looking at #{@guid}"
      p Redis.current
      p Redis.current.hgetall "alerts:#{@guid}"
      if Redis.current.hgetall("alerts:#{@guid}").empty? and !alert.title.match /(elevator|escalator)/i
        new_alert = Alert.new(id: @guid, message: alert.title)
        new_alert.link = alert.link unless alert.link.nil?
        p new_alert
        new_alert.save
        puts "Saved alert #{new_alert.id}\n\n"
      end
    end
  end

end


class AlertTweeter
  include TweetHelpers

  @queue = :tweeter_queue

  def self.perform
    # Run through list of untweeted alerts, tweetify, and tweet them
    untweeted_ids = Redis.current.smembers 'untweeted'
    p untweeted_ids
    
    untweeted_ids.each do |id|
      puts "-----------#{id}"
      p Redis.current.hgetall "alerts:#{id}"
      alert = Redis.current.hgetall("alerts:#{id}")
      tweetable_alert = TweetHelpers.tweetify alert
      puts tweetable_alert
      TweetHelpers.send_tweet tweetable_alert

      if Redis.current.srem 'untweeted', id
        puts "removed #{id} from untweeted queue"
      end

      sleep 5
    end
  end

end