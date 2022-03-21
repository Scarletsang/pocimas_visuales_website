require 'strscan'
require_relative 'markdown_parser.rb'

class ChoiceNode
  def initialize markdown, node_meta
    @str = StringScanner.new(markdown)
    @node_meta = node_meta
  end

  def to_array
    choice_ids = @node_meta["next"]
    regex = /
      \[front\]
      (?<front>(?:(?!\[back\])(?!={3,}\s*)(?:.|\n))*)
      \[back\]
      (?<back>(?:(?!\[front\])(?!={3,}\s*)(?:.|\n))*)
      (?:={3,}\s*|\z)
      |
      \[back\]
      (?<back>(?:(?!\[front\])(?!={3,}\s*)(?:.|\n))*)
      \[front\]
      (?<front>(?:(?!\[back\])(?!={3,}\s*)(?:.|\n))*)
      (?:={3,}\s*|\z)
    /x
    choice_ids.map do |id|
      return if @str.eos?
      @str.scan_until(regex)
      next if !@str.captures
      choice = {}
      choice["id"] = id
      choice["front"] = @str[:front]
      choice["back"]  = @str[:back]
      choice
    end
  end
end