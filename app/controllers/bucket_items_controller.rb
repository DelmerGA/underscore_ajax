class BucketItemsController < ApplicationController

	def index
	    @bucket_items = BucketItem.all
	    @bucket_item = BucketItem.new
	    
	    respond_to do |format|
	        format.html
	        format.json {render :json => @bucket_items }
	    end
	    
	end    

	def create
    	@bucket_item = BucketItem.create(params[:bucket_item])
    	render :json => @bucket_item
 	end

	def destroy
	    BucketItem.delete(params[:id])
	    render nothing: true
	end


end
