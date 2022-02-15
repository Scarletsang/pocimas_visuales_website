require 'yaml'
require 'haml'
require_relative 'markdown_parser.rb'

UPLOAD_FOLDER = "uploads/"
VIEWS_FOLDER = "views/"
MARKDOWN_FOLDER = "#{UPLOAD_FOLDER}markdown/"

class Document
	attr_reader :hash
	def initialize(hash)
		@haml = VIEWS_FOLDER + "document.haml"
		@hash = hash
	end

	def change_hash
		yaml = File.read(UPLOAD_FOLDER + "nodes.yaml")
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