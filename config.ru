#\ -s puma
require_relative 'src/app.rb'
require_relative 'src/paths.rb'
require_relative 'src/renderer.rb'

class PreCompiling
  include Paths
  def initialize env
    case env
    when "production"
      html_path = pre_render(PUBLIC_FOLDER, WEBSITE_META_YAML)
      system("rollup -c")
      File.delete(html_path) if File.exist?(html_path)
      # Run Server
    when "development"
      pre_render(PUBLIC_FOLDER, WEBSITE_META_YAML)
    end
  end
end

PreCompiling.new ENV["RACK_ENV"]
run App