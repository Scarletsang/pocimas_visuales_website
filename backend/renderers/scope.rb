require_relative 'base.rb'

class Scope < RendererBase
  def to_hash
    @content.each_value do |scope|
      scope["members"].push(scope["head"])
    end
  end
end