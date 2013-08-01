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
				template: "main",
				
				afterRender: function () {
					$(".copyright").fadeIn(3000);
				}
			});
			app.layouts.main.render();
				
			app.layouts.nav = new Backbone.Layout({
				className: "nav",
		  		template: "nav",
		  		isloaded: false,
		  		
		  		afterRender: function () {
			  		var list = this.tagName + "." + this.className;
			  		_(this.links).each(function (link) {
				  		$(list).append([
					  		"<a class='navlink' id='" + link.slug + "' href='" + link.slug + "'>" + link.title + "</a>"
				  		]);
			  		});
			  		
			  		
			  		$("a.navlink").click(function () {
			  			$("a.navlink").removeClass("currpage");
						$(this).addClass("currpage");
					});
			  		
			  		$("#" + Backbone.history.fragment).addClass("currpage");
			  		$("." + this.className).fadeIn(2000);
		  		}
			});
			
			_.extend(app.layouts.nav, Backbone.Events);
			
			app.layouts.home = new Backbone.Layout({
				template: "home",
				className: "logo",
				
				afterRender: function () {
					$(".logo").fadeIn(1000);
					// fade in
				}
			});
			
			
			Router.getPosts(function (data, kind) {
				
				console.log(data, kind);
						
				if ( kind == "pages" ) {
					app.layouts.nav.links = [];
				
					_.each(data.posts, function(page, ix) {
						
						// data manipulation of posts
						app.layouts.nav.links.push({
							"title": page.title,
							"slug": page.slug,
							"content": page.content,
							"attachments": page.attachments,
							"order": page.order
						});
						
						if (ix == data.posts.length-1) {
							app.layouts.nav.links = _(app.layouts.nav.links).sortBy("order");
							var list = _(app.layouts.nav.links).map(function (d) { return d.slug; });
							app.layouts.nav.isloaded = true;
							app.layouts.nav.trigger("loaded", list);
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
			$(".saranwrap").fadeOut(250, function () {
				$(".saranwrap").remove();
				$(".homenav").animate({"top": "55%"}, 500, function () {
					app.layouts.main.setView(".tupperware", app.layouts.home).render();
				});
			});
		}
		
		else {
			// coming from offsite
			app.layouts.nav.on("loaded", function (list) {
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
		
		if (app.layouts.nav.isloaded) {
			if ($(".nav").length) shownav("move"); // coming from home */
			else shownav("enter"); // coming from the outside world
		}
		else {
			app.layouts.nav.on("loaded", function (list) {
				if ($(".nav").length) shownav("move"); // coming from home */
				else shownav("enter"); // coming from the outside world
			});
		}
		
		
		
		function shownav(directive) {
			var pagelist = _(app.layouts.nav.links).map(function (d) { return d.slug; });
			console.log(pagelist);
			if (_(pagelist).contains(page)) {
				// incoming page parameter matches a real page
				console.log("page " + page + " is real, and the directive is " + directive);
				
				if (directive == "move") {
					// coming from home, slide nav
					if (!$(".defnav").length) {
						$(".logo").fadeOut(200, function () {
							$(".logo").remove();
							$(".compass").removeClass("homenav").addClass("defnav");
							$(".defnav").animate({"top": ".2em"}, 500, function () {
								showmeyour(page);
							});
						});
					}
					else showmeyour(page);
				}
				
				else if (directive == "enter") {
					// coming from offsite, fade nav in
					app.layouts.main.setView(".compass", app.layouts.nav).render().done(function () {
						$(".compass").removeClass("homenav").addClass("defnav");
						$(".defnav").css({"top": ".2em"});
						showmeyour(page);
					});
				}
	    	}
	    	
	    	
	    	else {
	    		// incoming page parameter doesn't match anything in the nav links list
	    		console.log("page doesn't exist, sending you home... directive was " + directive);
	    		cmp.navigate("", {trigger: true});
    		}	
		}
		
		function showmeyour(thing) {
			console.log("showing you the " + thing);
			
			if (!$(".saranwrap").length) $(".tupperware").append([
				"<div class='saranwrap'></div>"
			]);
			
			if (thing == "news" || thing == "plays" || thing == "press") {
				
			}
			
			else {
				var cmp = _(app.layouts.nav.links).where({ "slug": thing });
				console.log("about to append " + cmp[0].slug);
				$(".saranwrap").html("<div class='tinfoil'>" + cmp[0].content + "</div>");
			}
			
			$(".saranwrap").fadeIn(250);
			
		}
	},
	
	splat: function () {
	    console.log("splattering");
	    this.navigate("", {trigger: true});
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
