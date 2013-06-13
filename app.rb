#!/usr/bin/env ruby

require 'sinatra'
require 'redis'
require 'redis-objects'

require 'twitter'
require 'omniauth-twitter'
require 'bitly'

require 'resque'
require 'clockwork'

require 'haml'
require 'json'

require 'rss'

require "bundler/setup"
Bundler.require(:default)
require './jobs'
require './models/alert'

class App < Sinatra::Application

  Twitter.configure do |config|
    config.consumer_key = ENV['TWITTER_CONSUMER_KEY']
    config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
    config.oauth_token = ENV['TWITTER_ACCESS_TOKEN']
    config.oauth_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
  end

  uri = URI.parse(ENV["REDISTOGO_URL"])
  REDIS = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
  Resque.redis = REDIS


  FEED_URL = "http://realtime.mbta.com/alertsrss/rssfeed4"

  before do
    @feed = RSS::Parser.parse( open FEED_URL  )
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