module TweetHelpers
  # Make MBTA alerts tweetable

  @bitly = Bitly.new 'mbtaalerts', ENV['BITLY_TOKEN']

  def self.tweetify(alert)
    tweet = alert['message'].dup
    tweet = hash_transit_line(tweet)
    tweet = shorten_locales(tweet)
    #tweet = decap_tweet(tweet)
    
    unless alert['link'].nil?
      shortlink = @bitly.shorten(alert['link'].dup).short_url
      tweet << " #{shortlink}" unless tweet.length + shortlink.length > 140
    end
    tweet = tweet.dup[0..139]
    puts "FINAL TWEET: #{tweet}"
    return tweet
  end


  def self.hash_transit_line(tweet)
    colors = %w(Red Green Orange Blue Silver)
    hashed_tweet = tweet.dup
    colors.each do |color|
      hashed_tweet.gsub! /#{color} line/i, "##{color}Line"
    end
    return hashed_tweet
  end

  def self.shorten_locales(tweet)
    # and months and days
    locale_designations = { 
                square:  "Sq",
                center:  "Ctr",
                street:  "St",
                place:   "Pl",
                avenue:  "Ave",
                heights: "Hts",
                station: "Sta",
                january: "Jan",
                february:"Feb",
                march:   "Mar",
                april:   "Apr",
                may:     "May",
                june:    "Jun",
                july:    "Jul",
                august:  "Aug",
                september: "Sep",
                november:  "Nov",
                december:  "Dec",
                monday:    "Mon",
                tuesday:   "Tue",
                wednesday: "Wed",
                thursday:  "Thu",
                friday:    "Fri",
                saturday:  "Sat",
                sunday:    "Sun" }
    
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
    max_attempts = 3
    num_attempts = 0
    begin
      num_attempts += 1
      Twitter.update tweet
    rescue Twitter::Error::TooManyRequests => error
      if num_attempts <= max_attempts
        puts "sleeping due to too many attempts"
        sleep error.rate_limit.reset_in
        REDIS.lpush ['errorlog', "#{error}"]
        retry
      else
        raise
      end
    end
  end

  
end