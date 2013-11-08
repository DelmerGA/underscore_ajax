# Bucket List App
## Intro To Underscore and Ajax

# Bucket List App
## Intro To Underscore and Ajax
We can start an app
let's call it a `bucket_list_app`

    rails new bucket_list_app
    
    rails g model bucket_item title description completed:boolean
    
    rake db:migrate
    


This is the seed file we will paste into our `seeds.rb` in the `/db` folder

    BucketItem.create(
    	[ {title: "See the Pyramids", description: "Love ancient Egypt!", completed: false },
	    {title: "See the Golden Gate Bridge", description: "Love Bridges!", completed: false },
	    {title: "See the Great Wall of China", description: "Whoot for big walls", completed: false },
	    {title: "Go to Antarctica", description: "Cold Dark Places", completed: false },
	    {title: "Go to the Himalayas", description: "Pretty quiet", completed: false },
	    {title: "Ride a horse through Petra", description: "go to Jordan", completed: false },
	    {title: "Climb in the Grampians", description: "go to Aus", completed: false },
	    {title: "See lemurs", description: "go to Madagascar", completed: false },
	    {title: "See a snow monkey", description: "go to Japan", completed: false },
	    {title: "Visit ancient rice paddies", description: "go to China", completed: true },
	    {title: "Surf in Hawaii", description: "ride mellow waves in warm water", completed: false }
	    ]
    )
    
    
    
Now you can 

	 rake db:seed 
    
and if you `rake db:reset` what do you see if you type `@BucketItem.all`
in the console?

    rake db:drop to drop our tables
    
    rake db:create to create our db
    
    rake db:migrate to create our tables
    
    rake db:seed to seed our database
    
    
    rails g controller BucketItems index

    

Before we start editing the controller lets 
clean up the routes.rb
add 
    
    root to: "bucket_items#index"
    
    resources :bucket_items 

in the index we want to start putting some logic

    def index
        #Used later as well
        @bucket_items = BucketItem.all
        #Useful later for creating a form
        @bucket_item = BucketItem.new
    
        respond_to do |format|
            format.html # which will just go find and rend index.html.erb
            format.json { render :json => @bucket_items } # renders @bucket_items.to_json
        end 
    end
    

What do you see if you go to `http://localhost:3000/bucket_items.json`???


you should see

    [{"completed":false,"created_at":"2013-11-01T01:15:21Z","description":"Love ancient Egypt!","id":1,"title":"See the Pyramids","updated_at":"2013-11-01T01:15:21Z"},....]
    
    
Now before we go any further, let's grab our js for underscore

##[underscore raw](https://raw.github.com/jashkenas/underscore/master/underscore-min.js)

We need to select all that code and copy it into our `app/assets/

or in command line in the directory for your app

    curl -G https://raw.github.com/jashkenas/underscore/master/underscore-min.js > app/assets/javascripts/underscore.js

in your Web Console

<pre style="color:blue">
    TYPE THIS _.VERSION 
    GET THIS => 1.5.2 (if it works)
</pre>

Now we should on our index.html.erb

Anil Says :> Note guys! jQuery let's us do ajax three different ways

| jQuery Ajax	|
| :--- |       
|  $.post() |
|  $.get()  |
|  $.ajax() // For the rest|


    <h1> Bucket List </h1>
    <!-- This is for creating new items -->
    
    <%= form_for @bucket_item do |f| %>
        
        <%= f.text_field :title, placeholder: "Title" %> <br>
        
        <%= f.text_area :description, placeholder: "Description" %> <br>
        
        <%= f.submit %>
        
    <% end %>
    
    
    <!-- This is for appending items -->
    <div id="bucket_items">
    </div>


Now let's move to our `/application.js` and attach a click to our sumbit button
and we need to do what to keep the page from reload?

    1.) event.preventDefault
    
    2.) need to wait for that submit to load in the DOM.

    3.) We can also define a template for loading each item into the 'bucket_items' div
    
  <br>
    
<i>/application.js</i>

    //WAIT FOR DOM TO LOAD BEFORE ATTACHING EVENT LISTENERS
    $(function(){
        
        // USING UNDERSCORE TEMPLATES: NOTE 1 BELOW
        // note use single ticks (') for starting strings
        // and you can use double ticks (") inside
        //      our initial template
        //      var bucket_template = _.template('<div id="<%= id %>"> <%= title %> </div>')
        
        // We add delete and checkbox buttons
        var bucket_template = _.template('<div id="<%= id %>">' +
                                         'Title: <%= title %> <br>' + 
                                         'Description: <%= description %><br>' +
                                         '<input  data-id="<%= id  %>" <%= completed? "checked":""%> type="checkbox">' +
                                         '<button data-id="<%= id  %>" data-method="delete">Delete</button></div>')
     
        
        // We need to grab the SUBMIT button it has the `name="commit"`
        $('input[name="commit"]').click(function(event){
            // keep the page from reloading
            event.preventDefault()
            
            // Recall when talked about the params hash?
            // We want to build that hash up and send it
            // to server...  so we need to grab it from 
            // each input field
            
            // Grab fields
            var $title = $('#bucket_item_title')
            var $description = $('#bucket_item_description')
            
            // If we type  
            //
            //      var $title = $('#bucket_item_title')
            //      console.log($title)
            //
            // in our webconsole we see it returns the input field
            //      console.log($title.val()) 
            // returns the actual value in that field
            
            // Build params
            var params = { bucket_item: {title: $title.val(),
                                         description: $description.val() }}
            
             // We have to clear the form after someone clicks
            // so we replace the field value with an empty string
            $title.val("")
            $description.val("")
            
            // Finally we need to make an ajax request with those 
            // params we created
            
            // We use post because we are creating!b
            // What route are we posting to? Why?
            $.post("/bucket_items", params).done(function(response_data){
                console.log(response_data);
                
                var bucket_html = bucket_template(response_data)
                
                // Let's prepend that to the div
                $("#bucket_items").prepend(bucket_html);
                
            })
            
        })
        
        
        // Make sure we display all of our objects
        // We can make a GET request
        $.get("/bucket_items.json").done(function(response_data){
            
            //We can check to make sure we get a respone back
            // by logging
            console.log(response_data);
            
            // We go through each item in the response data
           _.each(response_data, function(item){
                
               // We need to render the item as html      
               var bucket_html = bucket_template(item)
               
               // We need to put the bucket_html in the div
               $('#bucket_items').prepend(bucket_html)
            })
            
        });
        
        // Begins editing template
        
        // Lets delegate to all bucket_items a click event handler on the delete button
        $('#bucket_items').on('click', 'button[data-method="delete"]', function(event){
            console.log(this);
            // We can grab this button with jQuery
            // console.log($(this).parent())
            
            // We could say $(this).parent().attr("id")
            // and delete that item
            
            var id = $(this).attr("data-id")
            
            // 1.)  We need to use the id to 
            //      send a delete request over ajax -- 
            //      we also have a controller method 
            //      to hanlde that delete
            
            // 2.)  When that happens we need to remove it
            //      from the DOM
            
            $.ajax({
                url: "/bucket_items/"+id,
                method: "DELETE"
            }).done(function(data){
                var item_id = "#"+id;
                $(item_id).remove();
            })
        });
        
        
        //Let's work on our checkbox
        $('#bucket_items').on('click', 'input[type="checkbox"]', function(event){
             var id = $(this).attr('data-id');
             var checked = this.checked;
             console.log(checked);
             
             
         $.ajax({
            url: "/bucket_items/" + id,
            method: "PUT",
            data: {bucket_item: {completed: checked}}
         })
    
    });
    
})

* NOTE 1.[template](http://underscorejs.org/#template)*

We need to handle the create in our `BucketItemsController` using `#create`  

    def create
        # recall params[:bucket_item]
        @bucket_item = BucketItem.create(params[:bucket_item])
        
        render :json => @bucket_item, status: 201
    end

We need to define a destroy method to remove the object from the DB
    
      def destroy 
         BucketItem.delete(params[:id])
         render text: "removed bucket_item #{id}", status: 200
     end


We need an update method to handle the `PUT`

    def update
        @bucket_item = BucketItem.find(params[:id])
        @bucket_item.update_attributes(params[:bucket_item])
        
        render nothing: true, status: :success
    end



