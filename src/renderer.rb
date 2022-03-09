require 'yaml'
require 'haml'
require_relative 'markdown_parser.rb'
require_relative 'paths.rb'

class Document
	include Paths
	attr_reader :hash
	def initialize(hash)
		@haml = VIEWS_FOLDER + "document.haml"
		@hash = hash
	end

	def change_hash
		yaml = File.read(NODES_CONNECTION_YAML)
		raw_nodes = YAML.load(yaml)
		nodes = []
		raw_nodes.each do |node_id, node_meta|
			node_meta["id"] = node_id
			node = Node.new(node_meta).render
			nodes.append(node)
		end
		@hash["nodes"] = nodes
	end

	def render
		change_hash
		@hash.transform_keys!(&:to_sym)
		haml = Haml::Engine.new File.read(@haml)
		haml.render Object.new, @hash
	end
	
	def self.from_yaml(file)
		yaml = File.read(file)
		self.new YAML.load(yaml)
	end
end

class Node
	include Paths
	def initialize(hash)
		@haml = VIEWS_FOLDER + "node.haml"
		@hash = hash
	end

	def change_hash
		@hash["node_next"] = @hash.delete("next").join(',') if @hash["next"]
		@hash["nav"] = @hash["nav"].join(',') if @hash["nav"]
		markdown_file = @hash.delete("file")
		return if !markdown_file
		@hash["node_content"] = UnStructureContent.from_markdown(MARKDOWN_FOLDER + markdown_file)
	end

	def render
		change_hash
		@hash.transform_keys!(&:to_sym)
		haml = Haml::Engine.new File.read(@haml)
		haml.render Object.new, @hash
	end
end

module UnStructureContent
	def self.from_markdown(file)
		input_text = File.read(file)
		options = {
			:input => 'CustomKramdown',
			:parse_block_html => true
		}
		Kramdown::Document.new(input_text, options).to_html
	end
end

def pre_render(dest_folder, website_meta_yaml)
	rendered = Document.from_yaml(website_meta_yaml).render
	Dir.chdir(dest_folder) do
		html = File.new("index.html", "w")
		html.puts rendered
	end
	puts "Successfully pre-rendered index.html in the folder #{File.expand_path(dest_folder, Dir.pwd)}!"
	File.expand_path("index.html", dest_folder)
end