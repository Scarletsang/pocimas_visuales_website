require_relative "../src/renderer.rb"

puts Document.from_yaml(UPLOAD_FOLDER + "config.yaml").render