require 'yaml'

def from_yaml file
  content = File.read(file)
	YAML.load(content)
end