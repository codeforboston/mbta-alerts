#!/usr/bin/env ruby

require 'sinatra'
require 'omniauth-twitter'
require 'twitter'
require 'redis'
require 'haml'
require 'json'

require 'rss'

=begin
# Configure redis

configure do
  services = JSON.parse(ENV['VCAP_SERVICES'])
  redis_key = services.keys.select { |svc| svc =~ /redis/i }.first
  redis = services[redis_key].first['credentials']
  redis_conf = { :host => redis['hostname'], :port => redis['port']. :password => redis['password'] }
  @@redis = Redis.new redis_conf
  r = Redis::Namespace.new(:ns, :redis => @r)
end
=end

=begin
# Establish Twitter authorization

use OmniAuth::Builder do
  provider :twitter, ENV['CONSUMER_KEY'], ENV['CONSUMER_SECRET']
end
=end

class App < Sinatra::Application

  @@url = "http://realtime.mbta.com/alertsrss/rssfeed4"

  before do
    @feed = RSS::Parser.parse( open(@@url) )
    @title = "(#{@feed.items.length}) #{@feed.channel.title}"
    @alerts = @feed.items.reverse
  end

  get "/" do
    haml :index
  end

end