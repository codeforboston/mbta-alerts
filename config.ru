# config.ru

require './app'
require 'resque/server'

run Rack::URLMap.new \
  "/"       => Sinatra::Application,
  "/resque" => Resque::Server.new

use Rack::ShowExceptions

run App.new