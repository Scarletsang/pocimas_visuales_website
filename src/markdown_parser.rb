require 'kramdown/parser/kramdown'
require 'kramdown/converter/html'

class Kramdown::Converter::Html
	def convert_p(el, indent)
		if el.options[:transparent]
			inner(el, indent)
		elsif all_children_are_images?(el)
			el.children.reduce("") do |string, child|
				puts child.inspect
				case child.type
				when :img
					string << convert_gallery_image(child, indent)
				when :text
					string << convert_blank(el, indent)
				end
			end
		else
			format_as_block_html("p", el.attr, inner(el, indent), indent)
		end
	end

	def convert_gallery_image(el, indent)
		image_attr = el.attr.dup
		"#{' ' * (indent)}<img#{html_attributes(image_attr)} />"
	end

	def convert_img(el, _indent)
		"<img#{html_attributes(el.attr)} />"
	end

	def all_children_are_images?(el)
		el.children.each do |child| 
			if child.type != :img && child.value != "\n" then return false end
		end
		true
	end
end

class Kramdown::Parser::CustomKramdown < Kramdown::Parser::Kramdown
	def initialize(source, options)
		super
		@block_parsers.unshift(:gallery_tag)
	end

	GALLERY_STRING = "[gallery]\n"
	GALLERY_TAG_START = /\[gallery\]\n((?:\n|.)*?)\n$/

	def parse_gallery_tag
		@src.pos += @src.matched_size
		content = delete_tag(GALLERY_STRING)
		wrapper = Element.new(:html_element, "div")
		parse_blocks(wrapper, content)
		@tree.children << wrapper
	end

	define_parser(:gallery_tag, GALLERY_TAG_START, GALLERY_STRING)

	def delete_tag tag
		@src.matched[tag.length..-1]
	end

	def wrap_in_div text
		"<div>\n#{text}\n</div>"
	end

end