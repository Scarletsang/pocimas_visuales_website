require 'yaml'
require 'haml'
require 'json'
require_relative 'markdown_parser.rb'
require_relative 'markdown_structural_parser.rb'
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

class Scope
  include Paths
  def initialize(content)
    @content = content
  end

  def self.from_yaml(file)
    yaml = File.read(file)
    self.new YAML.load(yaml)
  end

  def to_hash
    @content.each_value do |scope|
      scope["members"].push(scope["head"])
    end
  end

  def to_json
    JSON.pretty_generate(to_hash())
  end

end

class Nodes
  include Paths
  def initialize(content)
    @content = content
  end

  def self.from_yaml(file)
    yaml = File.read(file)
    self.new YAML.load(yaml)
  end

  def to_hash
    content = deep_clone(@content)
    content.each do |node_id, node_meta|
      node_meta["id"] = node_id
      node_meta["nextIds"] = node_meta.delete("next") if node_meta["next"]
      router(node_meta)
    end
    content
  end

  def to_json
    JSON.pretty_generate(to_hash())
  end

  private

  def router node_meta
    return if !node_meta.has_key?("structure") || !node_meta.has_key?("file")
    markdown_file = node_meta.delete("file")
    markdown = File.read(MARKDOWN_FOLDER + markdown_file)
    case node_meta["structure"]
    when "choice"
      render_choice_node(markdown, node_meta)
    else
      render_normal_node(markdown, node_meta)
    end
  end

  def render_choice_node markdown, node_meta
    raw = ChoiceNode.new(markdown, node_meta).to_array
    choices = raw.map do |choice|
      choice["front"] = render_markdown(choice["front"])
      choice["back"] = render_markdown(choice["back"]) if choice["back"]
      choice
    end
    node_meta["data"] = choices
  end

  def render_normal_node markdown, node_meta
    node_meta["html"] = render_markdown(markdown)
  end

  def render_markdown markdown
    options = {
      :input => 'CustomKramdown',
      :parse_block_html => true
    }
    Kramdown::Document.new(markdown, options).to_html
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

    def compile_data_json_to dest_folder, nodes_yaml, scope_yaml
      file_name = "data.json"
      nodes = Nodes.from_yaml(nodes_yaml).to_hash
      scope = Scope.from_yaml(scope_yaml).to_hash
      hash  = {"nodes" => nodes, "scope" => scope}
      rendered = JSON.pretty_generate(hash)
      compile_to(rendered, dest_folder, file_name)
    end

    private

    def compile_to rendered_string, dest_folder, dest_file_name
      system('mkdir', '-p', dest_folder)
      Dir.chdir(dest_folder) do
        File.open(dest_file_name, "w") do |html|
          html.puts rendered_string
        end
      end
      puts "Successfully compiled #{dest_file_name} in the folder #{File.expand_path(dest_folder, Dir.pwd)}!"
      File.expand_path(dest_file_name, dest_folder)
    end
  end
end