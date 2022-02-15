require 'kramdown/parser/kramdown'
require 'kramdown/converter/html'

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
	def initialize(source, options)
		super
		@block_parsers.unshift(:gallery_tag)
		@block_parsers.unshift(:video_tag)
		@block_parsers.unshift(:audio_tag)
		@block_parsers.unshift(:recipe_tag)
	end

	GALLERY_STRING = "[gallery]"
	GALLERY_TAG_REGEX = /\[gallery\]\n((?:\n|.)*?)\n$/

	def parse_gallery_tag
		@src.pos += @src.matched_size
		wrapper = Element.new(:html_element, "div")
		parse_blocks(wrapper, @src.captures[0])
		@tree.children << wrapper
	end

	
	VIDEO_STRING = "!["
	VIDEO_TAG_REGEX = /\!\[(.*)\]\(((?:(?:.*\.(?:mp4|mov|webm|avi|mpeg|ogg|qt),)|(?:.*\.(?:mp4|mov|webm|avi|mpeg|ogg|qt)))+)\)/

	def parse_video_tag
		@src.pos += @src.matched_size
		wrapper = Element.new(:html_element, "video", controls: "")
		@src.captures[1].split(',').each do |video_src|
			video_format = video_src[/.*\.(.*)$/, 1]
			source_element = media_source(video_src, video_format, "video")
			wrapper.children << Element.new(:raw, source_element)
		end
		media_text = Element.new(:p, class: "media-text")
		media_text.children << Element.new(:raw, @src.captures[0])
		wrapper.children << media_text
		@tree.children << wrapper
	end
	
	AUDIO_STRING = "!["
	AUDIO_TAG_REGEX = /\!\[(.*)\]\(((?:(?:.*\.(mp3|mp4|wav|aac|flac|flv),)|(?:.*\.(mp3|mp4|wav|aac|flac|flv)))+)\)/
	
	def parse_audio_tag
		@src.pos += @src.matched_size
		wrapper = Element.new(:html_element, "audio", controls: "")
		@src.captures[1].split(',').each do |audio_src|
			audio_format = audio_src[/.*\.(.*)$/, 1]
			source_element = media_source(audio_src, audio_format, "audio")
			wrapper.children << Element.new(:raw, source_element)
		end
		media_text = Element.new(:p,class: "media-text")
		media_text.children << Element.new(:raw, @src.captures[0])
		wrapper.children << media_text
		@tree.children << wrapper
	end

	RECIPE_STRING = "[left]"
	RECIPE_TAG_REGEX = //

	def parse_recipe_tag
		
	end

	define_parser(:gallery_tag, GALLERY_TAG_REGEX, GALLERY_STRING)
	define_parser(:video_tag, VIDEO_TAG_REGEX, VIDEO_STRING)
	define_parser(:audio_tag, AUDIO_TAG_REGEX, AUDIO_STRING)
	define_parser(:recipe_tag, RECIPE_TAG_REGEX, RECIPE_STRING)

	def wrap_in_div text
		"<div>\n#{text}\n</div>"
	end

	def media_source(src, file_format, media_type)
		"<source src='#{src}' type='#{media_type}/#{file_format}'>"
	end

end