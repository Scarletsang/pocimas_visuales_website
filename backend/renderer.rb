require 'json'
require_relative 'renderers/website.rb'
require_relative 'renderers/nodes.rb'
require_relative 'renderers/scope.rb'
require_relative 'renderers/base.rb'

module Renderer
  class << self
    def compile_website_to dest_folder, website_config_yaml
      file_name = "index.html"
      rendered = Website.from_yaml(website_config_yaml).to_html
      compile_to(rendered, dest_folder, file_name)
    end
    
    def compile_nodes_json_to dest_folder, nodes_yaml
      render(Nodes, "nodes.json", dest_folder, nodes_yaml)
    end
    
    def compile_media_json_to dest_folder, media_yaml
      render(RendererBase, "media.json", dest_folder, media_yaml)
    end

    def compile_data_json_to dest_folder, nodes_yaml, scope_yaml, media_yaml
      file_name = "data.json"
      nodes = Nodes.from_yaml(nodes_yaml).to_hash
      scope = Scope.from_yaml(scope_yaml).to_hash
      media = RendererBase.from_yaml(media_yaml).to_hash
      hash  = {"nodes" => nodes, "scope" => scope, "media" => media}
      rendered = JSON.pretty_generate(hash)
      compile_to(rendered, dest_folder, file_name)
    end

    private

    def render renderer_class, file_name, dest_folder, yaml
      rendered = renderer_class.from_yaml(yaml).to_json
      compile_to(rendered, dest_folder, file_name)
    end

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