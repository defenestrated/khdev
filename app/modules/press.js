// Press module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Press = app.module();

  // Default Model.
  Press.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  Press.Collection = Backbone.Collection.extend({
  	loaded: false,
  	
    model: Press.Model
  });

  // Default View.
  Press.Views.Layout = Backbone.Layout.extend({
    template: "press"
  });

  // Return the module for AMD compliance.
  return Press;

});
