# tweetify
# Make MBTA alerts tweetable

module TweetHelpers

  def tweetify(alert)
    tweet = alert.dup
    tweet = hash_transit_line(tweet)
    tweet = shorten_locales(tweet)
    tweet = decap_tweet(tweet)
    puts "#{tweet.length} vs #{alert.length} (#{(tweet.length/alert.length.to_f})"
    return tweet
  end


  def hash_transit_line(tweet)
    colors = %w(Red Green Orange Blue Silver)
    my_tweet = tweet.dup

    colors.each do |color|
      my_tweet.gsub! /#{color} line/i, "##{color}Line"
    end
    return my_tweet
  end

  def shorten_locales(tweet)
    locale_designations = { square:  "Sq",
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


  def decap_tweet(tweet)
    decapped_tweet = tweet.gsub(/[A-Z]{2,}/) {"#{$~.to_s.decapitalize}"}
  end
  
end