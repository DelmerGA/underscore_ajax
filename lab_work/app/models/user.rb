class User < ActiveRecord::Base
  attr_accessible :name, :password_digest, :remember_token, :salt
end
