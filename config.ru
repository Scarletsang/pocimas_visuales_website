#\ -s puma
require "rake"
require_relative "backend/app.rb"

def precompile env
  load 'RakeFile'
  case env
  when "production"
    Rake::Task['prod'].invoke
  when "development"
    Rake::Task['dev'].invoke
  end
end

precompile ENV["RACK_ENV"]
run App