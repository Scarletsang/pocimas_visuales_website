require 'sinatra'
require_relative './renderer.rb'
require_relative './mappings.rb'

class App < Sinatra::Base
	include FORMATS
	configure :production, :development do
    enable :logging
  end

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
		halt 404 if mime_type.nil?
		file = File.expand_path("#{media_type}/#{params['captures'][1]}", settings.upload_folder)
		halt 404 unless File.exist? file
		logger.info file
		send_file file,
			:type => mime_type,
			:disposition => 'inline'
	end

	get /\/.*/ do
		halt 404
	end

end