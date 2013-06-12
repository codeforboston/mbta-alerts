# Make MBTA alerts tweetable
module TweetHelpers

  @bitly = Bitly.new 'mbtaalerts', ENV['BITLY_TOKEN']

  def self.tweetify(alert)
    tweet = alert['message'].dup
    tweet = hash_transit_line(tweet)
    tweet = shorten_locales(tweet)
    #tweet = decap_tweet(tweet)
    
    unless alert['link'].nil?
      shortlink = @bitly.shorten(alert['link'].dup).short_url
      tweet << " #{shortlink}" unless tweet.length + shortlink.length > 140
      puts "final tweet: #{tweet}"
    end
    return tweet
  end


  def self.hash_transit_line(tweet)
    colors = %w(Red Green Orange Blue Silver)
    my_tweet = tweet.dup
    colors.each do |color|
      my_tweet.gsub! /#{color} line/i, "##{color}Line"
    end
    return my_tweet
  end


  def self.shorten_locales(tweet)
    locale_designations = { 
                square:  "Sq",
                center:  "Ctr",
                street:  "St",
                place:   "Pl",
                avenue:  "Ave",
                heights: "Hts",
                station: "Sta" }
    
    short_tweet = tweet.dup
    locales = locale_designations

    locales.each do |long, short|
      short_tweet.gsub!(/#{long}/i, short)
    end
    return short_tweet
  end


  def self.decap_tweet(tweet)
    decapped_tweet = tweet.dup.gsub!(/[A-Z]{2,}/) {"#{$~.to_s.decapitalize}"}
    return decapped_tweet
  end


  def self.send_tweet(tweet)
    begin
      Twitter.update tweet
    rescue Twitter::Error => e
      redis.lpush ['errorlog', "#{e}"]
    end
  end

  
end