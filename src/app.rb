require 'sinatra'
require_relative 'renderer.rb'
require_relative 'mappings.rb'
require_relative 'paths.rb'

class App < Sinatra::Base
	include Paths
	include FORMATS

	configure do
		mime_type :mjs, 'text/javascript'
	end

	configure :production do
		set :public_folder, DIST_FOLDER

		html_path = pre_render(PUBLIC_FOLDER, WEBSITE_META_YAML)
		system("rollup -c")
		File.delete(html_path) if File.exist?(html_path)
		
		get '/' do
			send_file File.expand_path("index.html", DIST_FOLDER)
		end
	end
	
	configure :development do
		set :public_folder, PUBLIC_FOLDER
	end

	get '/dev' do
		Document.from_yaml(WEBSITE_META_YAML).render
	end

	get /\/(image|document)\/(.*\.([a-zA-Z0-9]+))/ do
		media_type = params['captures'][0]
		media_formats = MEDIA_FORMATS[media_type]
		mime_type = media_formats[params['captures'][2]]
		halt 404 if mime_type.nil?
		file = File.expand_path("#{media_type}/#{params['captures'][1]}", UPLOAD_FOLDER)
		halt 404 unless File.exist? file
		send_file file,
			:type => mime_type,
			:disposition => 'inline'
	end

	get /.*\.mjs/ do
		content_type :mjs
		pass
	end

	get /\/.*/ do
		halt 404
	end

end