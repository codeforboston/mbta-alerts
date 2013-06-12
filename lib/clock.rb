require 'clockwork'
require 'resque'

include Clockwork

every(2.minutes, 'Queueing minute job') { Resque.enqueue AlertUsher }
every(2.seconds, 'Queueing second job') { Resque.enqueue AlertTweeter }