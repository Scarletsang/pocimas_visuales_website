require 'sinatra'
require_relative './renderer.rb'

class App < Sinatra::Base
	set :public_folder, 'public'
	set :views, 'views'

	get '/' do
		Document.from_yaml(UPLOAD_FOLDER + "config.yaml").render
	end

	get '/image/og-img' do
		send_file File.expand_path('img/og_img.png', settings.public_folder),
			:type => "image/png",
			:disposition => 'inline'
	end

end