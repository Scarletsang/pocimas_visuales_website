#\ -s puma
require_relative 'backend/app.rb'
require_relative 'backend/paths.rb'
require_relative 'backend/renderer.rb'

class PreCompiling
  include Paths
  def initialize env
    Renderer.compile_website_to(PUBLIC_FOLDER, WEBSITE_META_YAML)
    Renderer.compile_data_json_to(DATA_FOLDER, NODES_CONNECTION_YAML, SCOPE_YAML)
    case env
    when "production"
      system("rm -rf dist/")
      system("rollup --config rollup.config.prod.js")
    when "development"
      system("rollup --config rollup.config.dev.js")
    end
  end
end

PreCompiling.new ENV["RACK_ENV"]
run App