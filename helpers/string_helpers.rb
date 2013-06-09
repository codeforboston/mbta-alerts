class String
  def decapitalize
    arr = self.dup.split
    return arr.each{ |word| word.downcase! ; word.capitalize! }.join(" ")
  end
end