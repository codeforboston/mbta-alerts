class Alert

  include Redis::Objects
  attr_reader :id, :message
  attr_accessor :link

  def initialize(*args)
    args.each do |arg|
      arg.each_pair do |k,v|
        instance_variable_set("@#{k}", v) unless v.nil?
      end
    end
  end

  def save
    save_string = ["#{self.class.to_s.downcase}s:#{id}"]
    self.instance_variables.each do |var|
      next if var == :@id  # Skip if it's the ID
      save_string << "#{var.to_s.delete "@" }"
      save_string << "#{self.instance_variable_get(var)}"
    end
    # Save hash object, untweeted list item atomically
    p save_string
    Redis.current.hmset(save_string)
    Redis.current.sadd 'untweeted', self.id
  end

end