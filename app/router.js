define([
  // Application.
  "app",
  "modules/post",
  "modules/play",
  "modules/press"
],

function(app, Post, Play, Press) {
	
	app.layouts = {};
	
	
/* 	_.extend(nugget, Backbone.Events); */

  // Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		
		initialize: function () {
			console.log("router initializing...");
			
			app.Posts = new Post.Collection({}).reset();
			app.Plays = new Play.Collection({}).reset();
			app.Press = new Press.Collection({}).reset();
			
			
			
			app.layouts.main = new Backbone.Layout({
				el: "body",
				template: "main"
			});
			app.layouts.main.render();
				
			app.layouts.nav = new Backbone.Layout({
				className: "nav",
		  		template: "nav",
		  		afterRender: function () {
			  		var list = this.tagName + "." + this.className;
			  		_(this.links).each(function (link) {
				  		$(list).append([
					  		"<a class='navlink' href='" + link.slug + "'>" + link.title + "</a>"
				  		]);
			  		});
			  		
			  		
			  		$("a.navlink").click(function () {
			  			$("a.navlink").removeClass("currpage");
						$(this).addClass("currpage");
					});
			  		
			  		
			  		$("." + this.className).fadeIn(2000);
		  		}
			});
			
			app.layouts.home = new Backbone.Layout({
				template: "home",
				
				afterRender: function () {
					$(".logo").fadeIn(1000);
					// fade in
				}
			});
			
			
			
			Router.getPosts(function (data, kind) {
				
				console.log(data, kind);
						
				if ( kind == "pages" ) {
					app.layouts.nav.links = {};
				
					_.each(data.posts, function(page, ix) {
						
		/* 					Router.route(page.title, "showpage") */
						// data manipulation of posts
						app.layouts.nav.links[page.slug] = {
							"title": page.title,
							"slug": page.slug,
							"content": page.content,
							"attachments": page.attachments
						};
						
						if (ix == data.count - 1) {
							app.layouts.nav.trigger("loaded");
						}
					});
				}
				
				else if ( kind == "posts" ) {
					_.each(data.posts, function(post, ix) {
						// data manipulation of posts
						app.Posts.add(new Post.Model({
							"title": post.title,
							"slug": post.slug,
							"content": post.content,
							"attachments": post.attachments
						}));
					});
				}
				
				else if ( kind == "plays" ) {
					_.each(data.posts, function(play, ix) {
						// data manipulation of plays
						app.Plays.add(new Play.Model({
							"title": play.title,
							"slug": play.slug,
							"content": play.content,
							"attachments": play.attachments
						}));
						
						if (ix == data.count - 1) app.Plays.loaded = true;
					});
				}
				
			});
	
	},
	
		
	routes: {
	  "": "index",
	  ":page": "showpage",
	  "*splat": "splat"
	},
	
	index: function() {
		console.log("index calling");
		if ($(".nav").length) {
			// coming from onsite
			$(".homenav").css("top", 0);
			$(".compass").removeClass("defnav").addClass("homenav");
			$("a.navlink").removeClass("currpage");
			$(".homenav").animate({"top": "55%"}, 500, function () {
				app.layouts.main.setView(".tupperware", app.layouts.home).render();
			});
		}
		
		else {
			// coming from offsite
			app.layouts.nav.on("loaded", function () {
				app.layouts.main.setView(".compass", app.layouts.nav).render().done(function () {
					$(".compass").addClass("homenav");
				});
			});
			$(document).ready(function () {
				app.layouts.main.setView(".tupperware", app.layouts.home).render();
			});
		}
	},
	
	showpage: function (page) {
		var cmp = this;
		console.log("showing page: " + page);
		
		if ($(".nav").length) shownav("move", showmeyour(page)); // coming from home
		else app.layouts.nav.on("loaded", shownav("enter"), showmeyour()); // coming from the outside world
		
		function shownav(directive) {
			if (_(app.layouts.nav.links).has(page)) {
				// incoming page parameter matches a real page
				console.log("page " + page + " is real, and the directive is " + directive);
				
				
				if (directive == "move") {
					// coming from home, slide nav
					if (!$(".defnav").length) {
						$(".logo").fadeOut(200, function () {
							$(".logo").remove();
							$(".compass").removeClass("homenav").addClass("defnav");
							$(".defnav").animate({"top": 0}, 500);
						});
					}
				}
				
				else if (directive == "enter") {
					// coming from offsite, fade nav in
					app.layouts.main.setView(".compass", app.layouts.nav).render().done(function () {
						$(".compass").removeClass("homenav").addClass("defnav");
					});
				}
				
				callback();
	    	}
	    	
	    	
	    	else {
	    		// incoming page parameter doesn't match anything in the nav links list
	    		console.log("page doesn't exist, sending you home");
	    		cmp.navigate("", {trigger: true});
    		}	
		}
		
		function showmeyour(thing) {
			
		}
	},
	
	plays: function () {
	    console.log("plays:");
	    
	    console.log(app.Plays.loaded);
	    
	/*
	    while(app.Plays.loaded === false) {
		    console.log("loading");
	    }
	*/
	
		_.each(app.Plays, function ( play ) {
			console.log(play.get("title"));
		});
	},
	
	splat: function () {
	    console.log("splattering");
	}
	
	});
	
	
	
	
	Router.getPosts = function(callback) {
	
		var localcheck = document.URL.search("samgalison.com");
	
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
	
			$.post("http://sandbox.samgalison.com/katiehenry/wp/?json=get_recent_posts&post_type='page'&count=0", function(data) {
				callback(data, 'pages');
			});
			$.post("http://sandbox.samgalison.com/katiehenry/wp/?json=get_recent_posts&post_type='post'&count=0", function(data) {
				callback(data, 'posts');
			});
			$.post("http://sandbox.samgalison.com/katiehenry/wp/?json=get_recent_posts&post_type='play'&count=0", function(data) {
				callback(data, 'plays');
			});
			$.post("http://sandbox.samgalison.com/katiehenry/wp/?json=get_recent_posts&post_type='press'&count=0", function(data) {
				callback(data, 'press');
			});
		}
	
	};
	
	return Router;

});
