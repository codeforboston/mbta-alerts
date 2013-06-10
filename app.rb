#!/usr/bin/env ruby

require 'sinatra'
require 'omniauth-twitter'
require 'twitter'
require 'redis'
require 'haml'
require 'json'

require 'rss'


class Alert
  attr_reader :id, :message, :tweeted, :link

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
    puts "Still to-do: get this to save to redis"
    puts "redis.hmset(#{save_string})"
  end
end

a = Alert.new(id: 12, message: "This is the tweet about Government Center's Green Line delay.", tweeted: false, link: "http://bitly.com/sjF9F0A")
a.save


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

  get "/:id" do
    haml :show
  end

  not_found do  
    status 404  
    "404'd! There's no page here!"
  end  

end