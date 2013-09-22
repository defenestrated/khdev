define([
  // Application.
  "app",
  "modules/post",
  "modules/play",
  "modules/press"
],

function(app, Post, Play, Press) {
	
	app.layouts = {};
	
	app.Gallery = Backbone.View.extend({
		className: "gallery",
		id: "defaultGallery",
		images: [],
		
		initialize: function () {
/*
			console.log(this.id + " gallery initializing... el:");
			console.log(this.el);
*/
		},
		
		afterRender: function () {
			var cmp = this;
			$("#" + cmp.id).append(cmp.el);

			var dessert = $("." + cmp.id);
			
			if (dessert.length !== 0) {
				
				// ---- mouse behavior stuff ----
				$(".gfill").mouseenter(function () {
					$(this).animate({"background-color": "rgba(0,0,0,0.7)"}, 100, "easeInQuad");
				});
				$(".gfill").mouseleave(function () {
					$(this).animate({"background-color": "rgba(0,0,0,0.0)"}, 300, "easeInQuad");
				});
			}
			
		}
	});
	
	// ! ~ photobox ~
	app.Photobox = Backbone.View.extend({
		className: "photobox",
		fodder: [],
		type: "",
		
		initialize: function () {
			var cmp = this;
			console.log("photobox initializing...");
			
			$(document).keydown(function(e) {
				if (e.keyCode == 27) {
					// esc
					cmp.destroy();
				}
			});
			
		},
		
		afterRender: function () {
			var cmp = this;
			console.log(cmp.fodder);
			
			cmp.crimage = _(cmp.fodder).where({"post_name": cmp.startimg});
			
			
			console.log("starting image: ");
			console.log(cmp.crimage);
			
			cmp.$el.append("<div id='primage'></div><div id='crimage'></div><div id='nximage'></div>");
			
			_(cmp.fodder).each(function (ell, ix) {
				cmp.$el.append();
			});
						
			$(".slate").append(cmp.el);
			cmp.$el.fadeIn(500);
		},
		
		destroy: function () {
			var cmp = this;
			console.log("self destructing");
			var nr = new Backbone.Router({});
			if (cmp.type == "post") nr.navigate("news", {trigger: true});
			if (cmp.type == "play") nr.navigate("plays", {trigger: true});
			$(cmp.el).fadeOut(500, "easeInOutQuad", function () {
				cmp.remove();
			});
		},
		
	});
	
	

	
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
					$("body").append("<div class='loading'><p>loading everything in the universe, hang on...</p></div>");
					$(".copyright").fadeIn(3000);
				}
			});
			app.layouts.main.render();
				
			app.layouts.nav = new Backbone.Layout({
				className: "nav",
		  		template: "nav",
		  		loaded: false,
		  		
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
			  		
			  		var ispostgallery = Backbone.history.fragment.search("galleries/post");
			  		var isplaygallery = Backbone.history.fragment.search("galleries/play");
			  		
			  		if (ispostgallery != -1) currpage = "news";
			  		if (isplaygallery != -1) currpage = "plays";
			  		if (ispostgallery == -1 && isplaygallery == -1) currpage = Backbone.history.fragment;
			  		$("#" + currpage).addClass("currpage");
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
			
			// ! ---- contact form ----
			CView = Backbone.Layout.extend({
				template: "contact",
				className: "contact",
				tagName: "form",
				
				attributes: {
					"data-bypass": "true"
				},
				
				afterRender: function () {
					var cmp = this;
					
					$("form.contact").submit(function (e) {
						e.preventDefault();
						var nameId = "#name_input";
						var emailId = "#email_input";
						var subId = "#subject_input";
						var msgId = "#message_input";
						
						var name = $(nameId).val();
						var email = $(emailId).val();
						var sub = $(subId).val();
						var msg = $(msgId).val();
						
						var goodtogo = true;
						var problems = [];
						
						if (name == '') {
							goodtogo = false;
							problems.push(nameId);
						}
						if (email == '') {
							goodtogo = false;
							problems.push(emailId);
						}
						if (sub == '') {
							goodtogo = false;
							problems.push(subId);
						}
						if (msg == '') {
							goodtogo = false;
							problems.push(msgId);
						}
						
						if (goodtogo) {
							var data = {
								"name" : name,
								"email": email,
								"to": "samface@gmail.com",
								"subject": sub,
								"message": msg
							}							
							cmp.submitInput(data);
						}
						
						else if (!goodtogo) {
							console.log("errors with: ", problems);
							for (var i = 0; i < problems.length; i++) {
								$(problems[i]).css({backgroundColor : 'rgba(0,0,0,1)'});
								$(problems[i]).animate({backgroundColor : 'rgba(0,0,0,0.1)'}, 1500, "easeOutQuad");
							}
							
						}
						
						
						return false;
					});	
				},
				
				// ! email ajax send
				submitInput: function (maildata) {
					var u = "php/sendmail2.php"; // uncomment for local
/* 					var u = "/katiehenry/php/sendmail2.php"; // uncomment for sandbox */
					
					console.log("submitting data to " + u);
					console.log(maildata);
					
					$.ajax({
						type: "POST",
						url: u,
						data: maildata,
						dataType: "json",
						success: function (data) {
							console.log(data);
							
							if (data.mailSuccess) {
								var h = $("form.contact").outerHeight();
								console.log("previous height: " + h);
								$("form.contact").fadeOut(250, function () {
									$(".saranwrap").append(
										"<div class='contact submitted'><p>thanks! your message was sent successfully.<p></div>"
									);
								});
							}
						}
					});
				}
			});
			
			app.layouts.contact = new CView({});
			
			app.isloaded = function() {
/*
				console.log("checking load status...");
				console.log("nav: " + app.layouts.nav.loaded);
				console.log("posts: " + app.Posts.loaded);
				console.log("plays: " + app.Plays.loaded);
				console.log("press: " + app.Press.loaded);
*/
				
				if (app.layouts.nav.loaded && app.Posts.loaded && app.Plays.loaded && app.Press.loaded && app.docready) {
					// shit's loaded!
					app.trigger("allready");
					$(".loading").fadeOut(function () {
						$(".loading").remove();
					});
				}
			};
			
			
			Router.getPosts(function (data, kind) {
				
				//! array generation
				
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
							"order": page.order,
							"thumbnail": page.thumbnail
						});
						
						if (ix == data.posts.length-1) {
							app.layouts.nav.links = _(app.layouts.nav.links).sortBy("order");
							var list = _(app.layouts.nav.links).map(function (d) { return d.slug; });
							app.layouts.nav.trigger("loaded", list);
							app.layouts.nav.loaded = true;
							app.isloaded();
						}
					});
				}
				
				else if ( kind == "posts" ) {
					
					_.each(data.posts, function(post, ix) {
						// data manipulation of posts
						app.Posts.add(new Post.Model({
							"title": post.title,
							"slug": post.slug,
							"date": post.date,
							"content": post.content,
							"attachments": post.attachments,
							"gallery_images": post.gallery_images
						}));
						
					});

					var list = _(app.Posts.models).map(function (d) { return d.get("title"); });
					app.Posts.trigger("loaded", list);
					app.Posts.loaded = true;
					app.isloaded();
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
						
						if (ix == data.count - 1) {
							app.Plays.loaded = true;
							app.isloaded();
						}
					});
				}
				
				else if ( kind == "press" ) {
					_.each(data.posts, function(press, ix) {
						// data manipulation of plays
						app.Press.add(new Press.Model({
							"title": press.title,
							"slug": press.slug,
							"content": press.content,
							"attachments": press.attachments
						}));
						
						if (ix == data.count - 1) {
							app.Press.loaded = true;
							app.isloaded();
						}
					});
				}
				
				
				
			});
	
	},
	
	// !== routes ==	
	routes: {
	  "": "index",
	  ":page": "showpage",
	  "galleries/:type/:whichgallery/*img" : "gallery",
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
			
			if (app.layouts.nav.loaded) {
				console.log("if");
				app.layouts.main.setView(".compass", app.layouts.nav).render().done(function () {
					$(".compass").addClass("homenav");
				});
			}
			else {
				console.log("else");
				app.layouts.nav.on("loaded", function (list) {
					app.layouts.main.setView(".compass", app.layouts.nav).render().done(function () {
						$(".compass").addClass("homenav");
					});
				});
			}
			
			$(document).ready(function () {
				app.layouts.main.setView(".tupperware", app.layouts.home).render();
				app.docready = true;
				app.isloaded();
			});
		}
	},
	

	showpage: function (page) {
		var cmp = this;
		console.log("showing page: " + page);
		
		if (typeof app.pb !== "undefined") app.pb.destroy();
		
		$(document).ready(function () {
			app.docready = true;
			app.isloaded();
		});
		
		if (app.allready) startshit();
		else app.on("allready", function () {startshit();});
		function startshit() {
			if (app.layouts.nav.loaded) {
				if ($(".nav").length) shownav("move"); // coming from home */
				else shownav("enter"); // coming from the outside world
			}
			else {
				app.layouts.nav.on("loaded", function (list) {
					if ($(".nav").length) shownav("move"); // coming from home */
					else shownav("enter"); // coming from the outside world
				});
			}
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
			
			if ($(".saranwrap").is(":hidden")) {
				dealwithpages();
			}
			else $(".saranwrap").fadeOut(150, "easeInQuad", function () {
				dealwithpages();
			});
			
			function dealwithpages() {
				$(".saranwrap").attr("class", "saranwrap " + thing);
				
				if ( thing == "news" ) {
					//!NEWS PAGE DISPLAY
					console.log("news is loaded? " + app.Posts.isloaded);
					
					function shownews() {
/* 						console.log("----- news show -----"); */
						var list = _(app.Posts.models).map(function (d) { 
							var date = Date.parse(d.get("date"));
							return d.get("title") + " -- " + date; 
						});
/* 						console.log(list); */
						
						
						var cmp = _(app.layouts.nav.links).where({ "slug": thing });
						var thumb = typeof cmp[0].thumbnail !== "undefined" ? "<img src='" + cmp[0].thumbnail + "'>" : "";
						
						var dinner = 
							"<div class='tinfoil'>" +
								thumb + 
								cmp[0].content + 
							"</div>";
								
						$(".saranwrap").html(dinner);
							
						_(app.Posts.models).each(function (ell, ix) {
/* 							console.log(ell.get("title")); */
							
							var sfx = function (d) {
								if (d.length == 2 && d.charAt(0) == "1") {
									return "th";
								}
								else {
									switch (d.charAt(d.length-1)) {
										case "1":
											return "st";
											break;
										case "2":
											return "nd";
											break;
										case "3":
											return "rd";
											break;
										default:
											return "th";
											break;
									}
								}
							}
							
							var date = Date.parse(ell.get("date"));
							var day = date.toString("d");
							var month = date.toString("MMMM");
							var year = date.toString("yyyy");
							
							var meal = "<div class='meal' id ='" + ell.get("slug") + "'><h1>" + ell.get("title") + "</h1>" +
								"<h2>" + month + " " + day + sfx(day) + ", " + year + "</h2>" +
								ell.get("content") + "</div>";
							
							$(".tinfoil").append(meal);
							
							
							
							if (ell.get("attachments").length > 1) {
								console.log(ell.get("title") + " has attachments");
								var postgallery = new app.Gallery({
									id: ell.get("slug")
								});
								
								postgallery.images = ell.get("attachments");
								
								postgallery.render();
							}
								
						});
					}
					
					if (app.Posts.isloaded) {
						shownews();
					}
					else app.Posts.on("loaded", function () {
						shownews();
					});
					
				}
				else if (thing == "plays" || thing == "press") {
					alert("not built yet");
				}
				
				else if (thing == "contact") {
					// ! CONTACT PAGE DISPLAY
					app.layouts.main.setView(".saranwrap", app.layouts.contact).render();
					if ($("form.contact").is(":hidden")) $("form.contact").show();
				}
				
				else {
					// ! DEFAULT PAGE DISPLAY
					
					// pick out the right page to show
					var cmp = _(app.layouts.nav.links).where({ "slug": thing });
	
					// set thumb if it exists:
					var thumb = typeof cmp[0].thumbnail !== "undefined" ? "<img src='" + cmp[0].thumbnail + "'>" : "";
					
					var dinner = 
						"<div class='tinfoil'>" +
							thumb + 
							cmp[0].content +
						"</div>";
					
					$(".saranwrap").html(dinner);
				}
				
				$(".saranwrap").fadeIn(500, "easeOutQuad");
			}
		}
	},
	
	gallery: function (type, gallery, soloimg) {
		var cmp = this;
		// separate posts / plays
		if (type == "post") {
			if (!$(".news").length) cmp.showpage("news");
			if (app.Posts.loaded) {
				photobox();
			}
			else app.Posts.on("loaded", function () {
				photobox();
			});
		
			
			
		}
		
		if (type == "play") {
			console.log("play gallery called");
		}
		
		function photobox() {
			console.log("you asked for the " + gallery + " " + type + " gallery, specifically image '" + soloimg + "'.");
			var post = _(app.Posts.models).find(function (d) { return d.get("slug") == gallery; });
			
			var entrees = post.get("gallery_images");
			
			console.log(entrees);
			
			app.pb = new app.Photobox({});
			app.pb.startimg = soloimg;
			app.pb.fodder = entrees;
			app.pb.type = type;
			app.pb.render();
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
			
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='page'&count=-1", function(data) {
				callback(data, 'pages');
			});
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='post'&count=-1", function(data) {
				callback(data, 'posts');
			});
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='play'&count=-1", function(data) {
				callback(data, 'plays');
			});
			$.post("http://localhost/katiehenry/wp/?json=get_recent_posts&post_type='press'&count=-1", function(data) {
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
