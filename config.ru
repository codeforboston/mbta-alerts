# config.ru

require './app'
require 'resque_scheduler'
require 'resque/scheduler'
require 'resque_scheduler/server'

use Rack::ShowExceptions

run App.new