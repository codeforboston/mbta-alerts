# config.ru

require './app'
require 'resque/server'

uri = URI.parse(ENV["REDISTOGO_URL"])
Redis.current = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
Resque.redis = Redis.current

run Rack::URLMap.new \
  "/"       => Sinatra::Application,
  "/resque" => Resque::Server.new

use Rack::ShowExceptions

run App.new