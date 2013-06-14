require 'rubygems'
require 'resque'
require './app'
require 'clockwork'

module Clockwork

  handler do |job|
    puts "Running #{job}:"
    Resque.enqueue(job)
  end

  every 60.seconds, AlertUsher
  every 30.seconds, AlertTweeter

end