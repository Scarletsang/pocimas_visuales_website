require 'kramdown/document'
require_relative "../src/markdown_parser.rb"
require_relative "../src/yaml_parser.rb"

MARKDOWN_FOLDER = "../uploads/markdown/"

def renderMarkdown(file_name)
	input_text = File.read(MARKDOWN_FOLDER + file_name)
	options = {
		:input => 'CustomKramdown',
		:parse_block_html => true
	}
	Kramdown::Document.new(input_text, options).to_html
end

puts from_yaml(MARKDOWN_FOLDER + "config.yaml")