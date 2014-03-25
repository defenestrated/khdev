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

        findpresses: function() {
            var cmp = this;
            if (app.debug) console.log("finding press posts for " + cmp.get("title"));
            cmp.set({presses: []});
            _(app.Press.models).each(function(p) {
                if (_(p.get("parent_plays")).contains(cmp.get("title"))) cmp.get("presses").push(p);
            });
            if (app.debug) console.log("presses for " + cmp.get("title") + ":");
            if (app.debug) console.log(cmp.get("presses"));
        }
  });

  // Default Collection.
  Play.Collection = Backbone.Collection.extend({
    loaded: false,

    model: Play.Model,
    initialize: function () {
      this.on("loaded", function (list) {
        // alert("posts loaded:\n\n" + list);
        this.isloaded = true;
      });
    }



  });



  // Default View.
  Play.Views.Layout = Backbone.Layout.extend({
    template: "play"
  });

  // Return the module for AMD compliance.
  return Play;

});
