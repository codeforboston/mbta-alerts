require 'resque/tasks'
task "resque:setup" => :environment

task :default do
  # just run tests, nothing fancy
  puts "rake task ran!"
end