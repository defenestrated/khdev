// Post module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Post = app.module();

  // Default Model.
  Post.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  Post.Collection = Backbone.Collection.extend({
  	loaded: false,
    model: Post.Model,
    initialize: function () {
	    this.on("loaded", function (list) {
/* 		    alert("posts loaded:\n\n" + list); */
		    this.isloaded = true;
	    });
    }
  });

  // Default View.
  Post.Views.Layout = Backbone.Layout.extend({
    template: "post"
  });

  // Return the module for AMD compliance.
  return Post;

});
