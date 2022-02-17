require 'sinatra'
require_relative './renderer.rb'
require_relative './mappings.rb'

class App < Sinatra::Base
	include FORMATS
	set :upload_folder, 'uploads'
	set :public_folder, 'public'
	set :views, 'views'

	get '/' do
		Document.from_yaml(UPLOAD_FOLDER + "config.yaml").render
	end

	get /\/(image|audio|video|document)\/(.*\.([a-zA-Z0-9]*))/ do
		media_type = params['captures'][0]
		media_formats = MEDIA_FORMATS[media_type]
		mime_type = media_formats[params['captures'][2]]
		pass if mime_type.nil?
		send_file File.expand_path("#{media_type}/#{params['captures'][1]}", settings.upload_folder),
			:type => mime_type,
			:disposition => 'inline'
	end

end