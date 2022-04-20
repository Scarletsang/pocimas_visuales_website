require 'yaml'
require 'json'

class RendererBase
  def initialize(content)
    @content = content
  end

  def self.from_yaml(file)
    yaml = File.read(file)
    self.new YAML.load(yaml)
  end

  def to_hash
    @content
  end

  def to_json
    JSON.pretty_generate(to_hash())
  end

end