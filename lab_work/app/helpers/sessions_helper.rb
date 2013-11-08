module SessionsHelper

	def sign_in( user )
		cookies.permenant[:remember_token] = user.remember_token
	end

	def current_user
		@current_user = User.find_by_remember_token(cookies.permenant[:remember_token])
	end


	def sign_out
		cookies.permenant[:remember_token] = nil
	end
end
