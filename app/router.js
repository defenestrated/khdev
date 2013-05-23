define([
  // Application.
  "app"
],

function(app) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
  
  	initialize: function () {
  		console.log("router initializing...");

		
		Router.getPosts(function (data, kind) {
			
			console.log(data, kind);
			
/*
			if ( kind == "pages" ) {
				var titles = [];
				_.each(data.posts, function(post) {
					// data manipulation of posts
					titles.push(post.title);
				});
				console.log(titles);
			}
			
			if ( kind == "posts" ) {
				var titles = [];
				_.each(data.posts, function(post) {
					// data manipulation of posts
					titles.push(post.title);
				});
				console.log(titles);
			}
*/
			
		
		});

		

	},

  	
    routes: {
      "": "index"
    },

    index: function() {

    }
  });
  Router.getPosts = function(callback) {
	  	
		var localcheck = document.URL.search("katiehenryplaywright.com");
				
		if (localcheck == -1) {
			// we're not on the web
			
			console.log("==== get posts: operating locally ====");
			
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='page'&count=0", function(data) {
				callback(data, 'pages');
			});
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='post'&count=0", function(data) {
				callback(data, 'posts');
			});
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='play'&count=0", function(data) {
				callback(data, 'plays');
			});
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='press'&count=0", function(data) {
				callback(data, 'press');
			});
			
			
			
			
			
				
		}

		else {
			// we're live!
			console.log("==== get posts: operating online ====");

			$.post("http:// FIX DOMAIN NAME /?json=get_recent_posts&count=0", function(data) {
				callback(data);
			});
		}

	};

  return Router;

});
