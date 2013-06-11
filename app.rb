#!/usr/bin/env ruby

require 'sinatra'
require 'redis'
require 'redis-objects'

require 'twitter'
require 'omniauth-twitter'
require 'bitly'

require 'haml'
require 'json'

require 'rss'



class App < Sinatra::Application

  Redis.current = Redis.new

  Twitter.configure do |config|
    config.consumer_key = ENV['TWITTER_CONSUMER_KEY']
    config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
    config.oauth_token = ENV['TWITTER_ACCESS_TOKEN']
    config.oauth_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
  end

  class Alert
    include Redis::Objects
    attr_reader :id, :message, :link

    def initialize(*args)
      args.each do |arg|
        arg.each_pair do |k,v|
          instance_variable_set("@#{k}", v) unless v.nil?
        end
      end
    end

    def save
      save_string = "'#{self.class.to_s.downcase}:#{id}'"
      self.instance_variables.each do |var|
        next if var == :@id  # Skip if it's the ID
        save_string << ", '#{var.to_s.delete "@" }'"
        save_string << ", \"#{self.instance_variable_get(var)}\""
      end
      # Save hash object, untweeted list item atomically
      redis.multi do
        redis.hmset save_string
        redis.sadd untweeted id
      end
    end

  end



  @@url = "http://realtime.mbta.com/alertsrss/rssfeed4"

  before do
    @feed = RSS::Parser.parse( open(@@url) )
    @title = "(#{@feed.items.length}) #{@feed.channel.title}"
    @alerts = @feed.items.reverse
  end

  get "/" do
    haml :index
  end

  get "/:id" do
    haml :show
  end

  not_found do  
    status 404  
    "404'd! There's no page here!"
  end  

end