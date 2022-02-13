require 'sinatra'
require 'haml'

class App < Sinatra::Base
	set :public_folder, 'public'
	set :views, 'views'

	get '/' do
		send_file File.join(settings.public_folder, 'index.html')
	end

	get '/image/og-img' do
		send_file File.expand_path('img/og_img.png', settings.public_folder),
			:type => "image/png",
			:disposition => 'inline'
	end

end