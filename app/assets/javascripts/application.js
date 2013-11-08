// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .



// WAIT FOR THE DOM TO LOAD
$(function(){

	// DEFINE A TEMPLATE
	var bucket_template = _.template( '<div id="<%= id %>">' +
                                  'Title: <%= title %> <br>' + 
                                  'Description: <%= description %>' +
                                  '<input type="checkbox" "<%= completed?"checked":"" %>>' +
                                  '<button data-method="delete"> DELETE</button>'+
                                  '</div>');
	// LOAD ALL BUCKET ITEMS
    $.get("/bucket_items.json")
    .done(function(data){
    	// console.log(data);

    	// We can use undescore to go through each item
    	_.each(data, function(item){
    		// Get the bucket_items div and append the data
    		$("#bucket-items").append(bucket_template(item));
    	})
    });

    // CREATE BUCKET ITEM
    $('input[name="commit"]').click(function(event){
        
        // We have to prevent page from refreshing
        event.preventDefault();
        //console.log(this, "Was clicked!");

        var $title = $('#bucket_item_title');
        var $description = $('#bucket_item_description');
        
        var params = { bucket_item: { title: $title.val(),
                                      description: $description.val()}}
        $title.val("");
        $description.val("");
        
       // 2. Post that data to the server
        
        $.post("/bucket_items", params).done(function(data){
            console.log("We submitted our params!", data);

            // append to div#bucket_items
            $("#bucket-items").append(bucket_template(data));
        });

    })

	// We need to delegate for the delete
	$('#bucket-items').on('click', 'button[data-method="delete"]', function(event){
		var $bucket_item  = $(this).parent();
		var id  = $bucket_item.attr("id");
        
        //console.log("bucket_item id is ", id );
        $.ajax({
           url: "/bucket_items/" + id,
     	   method: "DELETE"
        }).done(function(data){
        	$bucket_item.remove();
        });
     });


 });