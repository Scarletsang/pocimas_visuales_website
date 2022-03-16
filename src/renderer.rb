require 'yaml'
require 'haml'
require 'json'
require_relative 'markdown_parser.rb'
require_relative 'paths.rb'

class Website
  include Paths
  attr_reader :content
  def initialize(content)
    @template = VIEWS_FOLDER + "website.haml"
    @content = content
  end
  
  def self.from_yaml(file)
    yaml = File.read(file)
    self.new YAML.load(yaml)
  end
  
  def to_html
    @content.transform_keys!(&:to_sym)
    template = Haml::Engine.new File.read(@template)
    template.render Object.new, @content
  end
end

class Nodes
  include Paths
  def initialize(content)
    @template = VIEWS_FOLDER + "node.haml"
    @content = content
  end

  def self.from_yaml(file)
    yaml = File.read(file)
    self.new YAML.load(yaml)
  end
  
  def to_html
    html = ''
    template = Haml::Engine.new File.read(@template)
    deep_clone(@content).each do |node_id, node_meta|
      node_meta["node_next"] = node_meta.delete("next").join(',') if node_meta["next"]
      markdown_file = @hash.delete("file")
      node_meta["node_content"] = render_node_from(markdown_file) if markdown_file
      node_meta.transform_keys!(&:to_sym)
      html << template.render Object.new, node_meta
    end
    html
  end

  def to_json
    content = deep_clone(@content)
    content.each do |node_id, node_meta|
      markdown_file = node_meta.delete("file")
      node_meta["html"] = render_node_from(markdown_file) if markdown_file
    end
    JSON.pretty_generate(content)
  end

  private

  def render_node_from markdown_file
    input_text = File.read(MARKDOWN_FOLDER + markdown_file)
    options = {
      :input => 'CustomKramdown',
      :parse_block_html => true
    }
    Kramdown::Document.new(input_text, options).to_html
  end

  def deep_clone hash
    Marshal.load(Marshal.dump(hash))
  end
end

module Renderer
  class << self
    def compile_website_to dest_folder, website_config_yaml
      file_name = "index.html"
      rendered  = Website.from_yaml(website_config_yaml).to_html
      compile_to(rendered, dest_folder, file_name)
    end
    
    def compile_nodes_json_to dest_folder, nodes_yaml
      file_name = "nodes.json"
      rendered = Nodes.from_yaml(nodes_yaml).to_json
      compile_to(rendered, dest_folder, file_name)
    end
    
    private

    def compile_to rendered_string, dest_folder, dest_file_name
      Dir.chdir(dest_folder) do
        html = File.new(file_name, "w")
        html.puts rendered_string
      end
      puts "Successfully compiled #{file_name} in the folder #{File.expand_path(dest_folder, Dir.pwd)}!"
      File.expand_path(file_name, dest_folder)
    end
  end
end