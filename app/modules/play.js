// Play module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Play = app.module();

  // Default Model.
  Play.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  Play.Collection = Backbone.Collection.extend({
  	loaded: false,
  	
    model: Play.Model
  });

  // Default View.
  Play.Views.Layout = Backbone.Layout.extend({
    template: "play"
  });

  // Return the module for AMD compliance.
  return Play;

});
