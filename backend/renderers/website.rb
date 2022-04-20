require 'haml'
require_relative 'base.rb'
require_relative '../paths.rb'

class Website < RendererBase
  include Paths
  attr_reader :content
  def initialize(content)
    super(content)
    @template = VIEWS_FOLDER + "website.haml"
  end
  
  def to_html
    @content.transform_keys!(&:to_sym)
    template = Haml::Engine.new File.read(@template)
    template.render Object.new, @content
  end
end