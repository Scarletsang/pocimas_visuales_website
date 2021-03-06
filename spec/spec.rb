require_relative '../src/paths.rb'
require_relative '../src/renderer.rb'
class Spec
  include Paths

  def test_json_compilation
    Dir.chdir("..") do 
      Renderer.compile_nodes_json_to(DATA_FOLDER, NODES_CONNECTION_YAML)
    end
  end
end

Spec.new().test_json_compilation