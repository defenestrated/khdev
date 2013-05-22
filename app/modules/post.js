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
    model: Post.Model
  });

  // Default View.
  Post.Views.Layout = Backbone.Layout.extend({
    template: "post"
  });

  // Return the module for AMD compliance.
  return Post;

});
