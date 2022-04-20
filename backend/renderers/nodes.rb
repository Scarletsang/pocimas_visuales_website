require_relative 'base.rb'
require_relative '../markdown_parser.rb'
require_relative '../markdown_structural_parser.rb'
require_relative '../paths.rb'

class Nodes < RendererBase
  include Paths
  def to_hash
    content = deep_clone(@content)
    content.each do |node_id, node_meta|
      node_meta["id"] = node_id
      node_meta["nextIds"] = node_meta.delete("next") if node_meta["next"]
      router(node_meta)
    end
    content
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