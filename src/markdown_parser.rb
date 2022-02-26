require 'kramdown/parser/kramdown'
require 'kramdown/converter/html'
require_relative './mappings.rb'

class Kramdown::Converter::Html
	def convert_p(el, indent)
		if el.options[:transparent]
			inner(el, indent)
		elsif all_children_are_images?(el)
			el.children.reduce("") do |string, child|
				case child.type
				when :img
					string << convert_img(child, indent)
				when :text
					string << convert_blank(el, indent)
				end
			end
		else
			format_as_block_html("p", el.attr, inner(el, indent), indent)
		end
	end

	def convert_img(el, indent)
		image_attr = el.attr.dup
		"#{' ' * (indent)}<img#{html_attributes(image_attr)} />"
	end

	def all_children_are_images?(el)
		el.children.each do |child| 
			if child.type != :img && child.value != "\n" then return false end
		end
		true
	end
end

class Kramdown::Parser::CustomKramdown < Kramdown::Parser::Kramdown
	include FORMATS
	def initialize(source, options)
		super
		@block_parsers.unshift(:gallery_tag)
		@block_parsers.unshift(:video_tag)
		@block_parsers.unshift(:audio_tag)
		@block_parsers.unshift(:pdf_tag)
		@block_parsers.unshift(:section_tag)
		@block_parsers.unshift(:left_section_tag)
		@block_parsers.unshift(:right_section_tag)
	end

	GALLERY_STRING = "[gallery]"
	GALLERY_TAG_REGEX = /\[gallery\]\s*\n((?:(?:\n|.)*?)(?:\n\n|\Z))/

	def parse_gallery_tag
		@src.pos += @src.matched_size
		wrapper = Element.new(:html_element, "div", class: "gallery")
		parse_blocks(wrapper, @src.captures[0])
		@tree.children << wrapper
	end
	
	VIDEO_STRING = "!["
	VIDEO_TAG_REGEX = /\!\[\s*(.*)\s*\]\(((?:\s*video\/.*\.(?:mp4|webm|ogg)\,?)+)\)/

	def parse_video_tag
		@src.pos += @src.matched_size
		wrapper = Element.new(:html_element, "video", controls: "")
		@src.captures[1].split(',').each do |video_src|
			video_format   = video_src[/.*\.(.*)$/, 1]
			source_element = media_source(video_src, video_format, VIDEO_FORMAT)
			wrapper.children << Element.new(:raw, source_element)
		end
		media_text = Element.new(:p, class: "media-text")
		media_text.children << Element.new(:raw, @src.captures[0])
		wrapper.children    << media_text
		@tree.children      << wrapper
	end
	
	AUDIO_STRING = "!["
	AUDIO_TAG_REGEX = /\!\[\s*(.*)\s*\]\(((?:\s*audio\/.*\.(mp3|mp4|wav|webm|aac|flac|ogg)\,?)+)\)/
	
	def parse_audio_tag
		@src.pos += @src.matched_size
		wrapper = Element.new(:html_element, "audio", controls: "")
		@src.captures[1].split(',').each do |audio_src|
			audio_format   = audio_src[/.*\.(.*)$/, 1]
			source_element = media_source(audio_src, audio_format, AUDIO_FORMAT)
			wrapper.children << Element.new(:raw, source_element)
		end
		media_text = Element.new(:p,class: "media-text")
		media_text.children << Element.new(:raw, @src.captures[0])
		wrapper.children    << media_text
		@tree.children      << wrapper
	end
	
	PDF_STRING = "!["
	PDF_TAG_REGEX = /\!\[\s*(.*)\s*\]\(\s*(document\/.*\.pdf)\s*\)/
	
	def parse_pdf_tag
		@src.pos += @src.matched_size
		wrapper     = Element.new(:html_element, "section", class: "pdf-link", :"data-href" => @src.captures[1])
		instruction = Element.new(:p, class: "pdf-instruction")
		pdf_title   = Element.new(:html_element, "h1", class: "pdf-title")
		instruction.children << Element.new(:raw, "PDF")
		pdf_title.children   << Element.new(:raw, @src.captures[0])
		wrapper.children     << instruction
		wrapper.children     << pdf_title
		@tree.children       << wrapper
	end
	
	SECTION_STRING = "="
	SECTION_TAG_REGEX = /\={3,}((?:(?!={3,})(?:.|\n))*)(={3,}|\Z)/
	
	def parse_section_tag
		@src.pos = @src.pos + @src.matched_size - @src.captures[1].length
		section_is_side_by_side = @src.captures[0].scan(LEFT_SECTION_TAG_REGEX) != [] && @src.captures[0].scan(RIGHT_SECTION_TAG_REGEX) != []
		class_name = section_is_side_by_side ? "side-by-side" : nil
		wrapper = Element.new(:html_element, "section", class: class_name)
		parse_blocks(wrapper, @src.captures[0])
		@tree.children << wrapper
	end
	
	LEFT_SECTION_STRING = "[left]"
	LEFT_SECTION_TAG_REGEX = /\[left\]((?:(?!\[right\])(?:.|\n))*)(\[right\]|(?:={3,})|\Z)/
	
	def parse_left_section_tag
		@src.pos = @src.pos + @src.matched_size - @src.captures[1].length
		wrapper = Element.new(:html_element, "div", class: "left")
		parse_blocks(wrapper, @src.captures[0])
		@tree.children << wrapper
	end
	
	RIGHT_SECTION_STRING = "[right]"
	RIGHT_SECTION_TAG_REGEX = /\[right\]((?:(?!\[left\])(?:.|\n))*)(\[left\]|(?:={3,})|\Z)/
	
	def parse_right_section_tag
		@src.pos = @src.pos + @src.matched_size - @src.captures[1].length
		wrapper = Element.new(:html_element, "div", class: "right")
		parse_blocks(wrapper, @src.captures[0])
		@tree.children << wrapper
	end

	define_parser(:gallery_tag, GALLERY_TAG_REGEX, GALLERY_STRING)
	define_parser(:video_tag, VIDEO_TAG_REGEX, VIDEO_STRING)
	define_parser(:audio_tag, AUDIO_TAG_REGEX, AUDIO_STRING)
	define_parser(:pdf_tag, PDF_TAG_REGEX, PDF_STRING)
	define_parser(:section_tag, SECTION_TAG_REGEX, SECTION_STRING)
	define_parser(:left_section_tag, LEFT_SECTION_TAG_REGEX, LEFT_SECTION_STRING)
	define_parser(:right_section_tag, RIGHT_SECTION_TAG_REGEX, RIGHT_SECTION_STRING)

	def wrap_in_div text
		"<div>\n#{text}\n</div>"
	end

	def media_source(src, file_format, media_formats)
		"<source src='#{src}' type='#{media_formats[file_format]}'>"
	end

end