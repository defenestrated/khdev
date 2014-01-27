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
           primage: "",
           crimage: "",
           nximage: "",

           initialize: function () {
             var cmp = this;
             console.log("photobox initializing...");

             cmp.router = new Backbone.Router({});

             console.log(cmp.options);
             $(document).keydown(function(e) {
               if (e.keyCode == 27) {
                 // esc
                 cmp.destroy();
               }

               else if (e.keyCode == 37) {
                 // left arrow
                 if (typeof cmp.primage !== "undefined") cmp.lineup(cmp.primage.slug);
               }

               else if (e.keyCode == 39) {
                 // right arrow
                 if (typeof cmp.nximage !== "undefined") cmp.lineup(cmp.nximage.slug);
               }
             });

           },

           afterRender: function () {
             var cmp = this;
             console.log("fodder:");
             console.log(cmp.options.fodder);

             cmp.crimage = _(cmp.options.fodder).where({"slug": cmp.options.startimg});
             console.log("starting image: ");
             console.log(cmp.options.startimg);



             cmp.$el.append(
               "<div class='pbcontainer'>" +
                 "<div class='primage'><p>previous</p></div>" +
                 "<div class='crimage'></div>" +
                 "<div class='nximage'><p>next</p><div id='x'>x</div></div>" +
                 "<div id='caption'></div>" +
                 "</div>"
             );

             $(".slate").append(cmp.el);

             cmp.lineup(cmp.options.startimg);
             cmp.turnon();

             $(".primage").click(function () { if (typeof cmp.primage !== "undefined") cmp.lineup(cmp.primage.slug); });
             $(".nximage").click(function () { if (typeof cmp.nximage !== "undefined" && !$(".nximage").find("#x:hover").length) cmp.lineup(cmp.nximage.slug); });
             $("#x").click(function () { cmp.destroy(); });

             cmp.sizefix();
             app.sizefix();
             cmp.$el.css({"visibility": "visible", "display": "none"}).fadeIn(500);
           },

           lineup: function (desiredCurrent) {
             var cmp = this;

             console.log("lining up");
             _(cmp.options.fodder).each(function (image, i) {
               /*       console.log(i + " - " + image.slug + " // " + desiredCurrent); */

               if (image.slug == desiredCurrent) {
                 console.log("-- found it -- ");
                 cmp.primage = cmp.options.fodder[i-1];
                 cmp.crimage = image;
                 cmp.nximage = cmp.options.fodder[i+1];

                 if (typeof cmp.primage !== "undefined") console.log("primage: " + cmp.primage.slug);
                 if (typeof cmp.crimage !== "undefined") console.log("crimage: " + cmp.crimage.slug);
                 if (typeof cmp.nximage !== "undefined") console.log("nximage: " + cmp.nximage.slug);

                 $(".crimage").html("<img src='" + cmp.crimage.images.large.url + "' />");
                 $(".crimage").wrap("<a data-bypass href='" + cmp.crimage.images.full.url + "' target='_blank'></a>");
                 $(".crimage").on("mouseenter", function () {
                   $("#caption").animate({"opacity": 0.2}, 600);
                 });
                 $(".crimage").on("mouseleave", function () {
                   $("#caption").animate({"opacity": 1.0}, 600);
                 });

                 $("#caption").html("<div id='captiontitle'>" + cmp.crimage.title + "</div><div id='captiondesc'>" + cmp.crimage.caption + "</div>");

                 cmp.router.navigate("galleries/" + cmp.options.type + "/" + cmp.options.postname + "/" + cmp.crimage.slug);
               }
             });

             /*
              ($("img.currimg").length) ?
              $("img.currimg").attr("src", cmp.crimage.images.large.url)
              : $("td.currimg").append("<img class='currimg' src='" + cmp.crimage.images.large.url + "' height=" + cmp.height + "></img>");

              if (typeof cmp.primage !== "undefined") {
              $("td.previmg").css("background", "url('" + cmp.primage.images.large.url + "') no-repeat center center");
              $("td.prev").css("cursor", "pointer");
              $("td.prev p").text(cmp.primage.title);
              $("td.prevs").text("prev");
              }
              else {
              $("td.prev").css("cursor", "");
              $("td.previmg").css("background-image", "");
              $("td.prev p").text("").css("background", "");
              $("td.prevs").text("");
              }
              if (typeof cmp.nximage !== "undefined") {
              $("td.nextimg").css("background", "url('" + cmp.nximage.images.large.url + "') no-repeat center center");
              $("td.next").css("cursor", "pointer");
              $("td.next p").text(cmp.nximage.title);
              $("td.nexts").text("next");
              }
              else {
              $("td.next").css("cursor", "");
              $("td.nextimg").css("background-image", "");
              $("td.next p").text("").css("background", "");
              $("td.nexts").text("");
              }


              $("tr.text td").css("height", cmp.height);
              $("td.previmg, td.nextimg, td.prev, td.next").css({
              "width": ($(window).width()-$("img.currimg").width())/2
              });
              $("td.curr, td.curr p").css({
              "width": $("td.currimg").width()
              });

              $("td.curr p").wrap("<a data-bypass href='" + cmp.crimage.url + "' target='_blank'></a>")
              */
           },

           turnoff: function () {
             $.fx.off = true;
             $("td.prev").off("mouseenter mouseleave");
           },

           turnon: _.debounce(function () {
             $.fx.off = false;

             $("td.prev, td.next").on('mouseenter', function (e) {
               if ($("." + e.currentTarget.className + " p").text() != "") {
                 $("." + e.currentTarget.className + "img").animate({"opacity": 0.3}, 200, "easeInOutQuad");
                 $("." + e.currentTarget.className + " p").animate({"background-color": "rgba(255,255,255,0.4)"}, 200, "easeInOutQuad");
               }
             });
             $("td.prev, td.next").on('mouseleave', function (e) {
               if ($("." + e.currentTarget.className + " p").text() != "") {
                 $("." + e.currentTarget.className + "img").animate({"opacity": 0.05}, 200, "easeInOutQuad");
                 $("." + e.currentTarget.className + " p").animate({"background-color": "rgba(255,255,255,0.0)"}, 200, "easeInOutQuad");
               }
             });

             $("td.previmg, td.nextimg, td.prev, td.next").css({
               "width": ($(window).width()-$("img.currimg").width())/2
             });
             $("td.curr").css({
               "width": $("td.currimg").width()
             });
           }, 200),

           sizefix: function () {
             $(".crimage").css({"left": ($(window).width()-$(".crimage").width())/2 + "px"});
             $(".primage p, .nximage p").css({"margin-top": $(".crimage").height()-50+"px"});
           },

           destroy: function () {
             var cmp = this;
             console.log("self destructing, going to type " + cmp.options.type);
             if (cmp.options.type == "post") cmp.router.navigate("news", {trigger: true});
             if (cmp.options.type == "play") cmp.router.navigate("plays", {trigger: true});
             $(cmp.el).fadeOut(500, "easeInOutQuad", function () {
               cmp.undelegateEvents();

               cmp.$el.removeData().unbind();

               //Remove view from DOM
               cmp.remove();
               Backbone.View.prototype.remove.call(cmp);
               console.log(cmp);
             });
           }

         });




         /* _.extend(nugget, Backbone.Events); */

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


                 // $("a.navlink").on("click", function (e) {
                 // console.log(e);
                 // e.preventDefault();
                 // $("a.navlink").removeClass("currpage");
                 // $(this).addClass("currpage");
                 // Router.navigate(e.currentTarget.id, {trigger: true});
                 // });

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
                 /*         var u = "/katiehenry/php/sendmail2.php"; // uncomment for sandbox */

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
                 app.allready = true;
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
                   app.Posts.add(new Post.Model(post));

                 });

                 var list = _(app.Posts.models).map(function (d) { return d.get("title"); });
                 app.Posts.trigger("loaded", list);
                 app.Posts.loaded = true;
                 app.isloaded();
               }

               else if ( kind == "plays" ) {
                 _.each(data.posts, function(play, ix) {
                   // data manipulation of posts
                   console.log(play);
                   app.Plays.add(new Play.Model(play));

                 });

                 var list = _(app.Plays.models).map(function (d) { return d.get("title"); });
                 app.Plays.trigger("loaded", list);
                 app.Plays.loaded = true;
                 app.isloaded();
               }

               else if ( kind == "press" ) {
                 _.each(data.posts, function(press, ix) {
                   // data manipulation of posts
                   app.Press.add(new Press.Model(press));
                 });

                 var list = _(app.Press.models).map(function (d) { return d.get("title"); });
                 app.Press.trigger("loaded", list);
                 app.Press.loaded = true;
                 app.isloaded();
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
                 app.layouts.main.setView(".compass", app.layouts.nav).render().done(function () {
                   $(".compass").addClass("homenav");
                 });
               }
               else {
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

             app.currpage = page;

             console.log("showing page: " + app.currpage);

             if (typeof app.pb !== "undefined") app.pb.destroy();

             $(document).ready(function () {
               app.docready = true;
               app.isloaded();
             });


             if (app.allready) {
               startshit();
             }
             else app.on("allready", function () {
               startshit();
             });
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
               // console.log(pagelist);
               if (_(pagelist).contains(app.currpage)) {
                 // incoming page parameter matches a real page
                 // console.log("page " + app.currpage + " is real, and the directive is " + directive);
                 $("a.navlink").removeClass("currpage");
                 $("a#" + app.currpage + ".navlink").addClass("currpage");

                 if (directive == "move") {
                   // coming from home, slide nav
                   if (!$(".defnav").length) {
                     $(".logo").fadeOut(200, function () {
                       $(".logo").remove();
                       $(".compass").removeClass("homenav").addClass("defnav");
                       $(".defnav").animate({"top": ".2em"}, 500, function () {
                         showmeyour(app.currpage);
                       });
                     });
                   }
                   else showmeyour(app.currpage);
                 }

                 else if (directive == "enter") {
                   // coming from offsite, fade nav in
                   app.layouts.main.setView(".compass", app.layouts.nav).render().done(function () {
                     $(".compass").removeClass("homenav").addClass("defnav");
                     $(".defnav").css({"top": ".2em"});
                     showmeyour(app.currpage);
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
               // console.log("showing you the " + thing);

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

                 var pageData, multi = false;

                 var thePage = _(app.layouts.nav.links).where({ "slug": thing });
                 var pagethumb = (typeof thePage[0].thumbnail !== "undefined") ?
                       "<img src='" + thePage[0].thumbnail + "'>" : "";

                 cmp.dinner =
                   "<div class='tinfoil'>" +
                   pagethumb +
                   thePage[0].content +
                   "</div>";

                 $(".saranwrap").html(cmp.dinner);

                 switch(thing) {
                 case "news":
                   pageData = app.Posts;
                   multi = true;
                   break;
                 case "plays":
                   pageData = app.Plays;
                   multi = true;
                   break;
                 case "press":
                   pageData = app.Press;
                   multi = true;
                   break;
                 case "contact":
                   multi = false;
                   app.layouts.main.setView(".saranwrap", app.layouts.contact).render();
                   if ($("form.contact").is(":hidden")) $("form.contact").show();
                   break;
                 default:
                   multi = false;
                   pageData = _(app.layouts.nav.links).where({ "slug": thing });
                   showSinglePage(pageData);
                   break;
                 }

                 if (multi === true) {
                   console.log(thing + " is loaded? " + pageData.isloaded);
                   if (pageData.isloaded === true) {
                     showMultiPostPage(pageData);
                   }
                   else pageData.on("loaded", function () {
                     showMultiPostPage(pageData);
                   });
                 }


                 $(".saranwrap").fadeIn(500, "easeOutQuad");
               }

               function showSinglePage(data) {
                 console.log("::: showing single page with the following data :::");
                 console.log(data);
                 console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::");
               }

               function showMultiPostPage(data) {
                 console.log("::: showing multi post page with the following data :::");
                 console.log(data);
                 console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::");

                 // var list = _(data.models).map(function (d) {
                 //   // var date = Date.parse(d.get("date"));
                 //   var date = d.get("date");
                 //   return d.get("title") + " -- " + date;
                 // });
                 // console.log(list);


                 _(data.models).each(function (ell, ix) {
                   var sfx = function (d) {
                     if (d.length == 2 && d.charAt(0) == "1") {
                       return "th";
                     }
                     else {
                       switch (d.charAt(d.length-1)) {
                       case "1":
                         return "st";
                       case "2":
                         return "nd";
                       case "3":
                         return "rd";
                       default:
                         return "th";
                       }
                     }
                   };

                   // maybe get moment.js and replace this crap with it?
                   var date = Date.parse(ell.get("date"));
                   var day = date.toString("d");
                   var month = date.toString("MMMM");
                   var year = date.toString("yyyy");

                   var meal = "<div class='meal' id ='" + ell.get("slug") + "'><h1>" + ell.get("title") + "</h1>" +
                         "<h2>" + month + " " + day + sfx(day) + ", " + year + "</h2>" +
                         ell.get("content") + "</div>";

                   $(".tinfoil").append(meal);



                   if (ell.get("attachments").length > 1) {
                     // console.log(ell.get("title") + " has attachments");
                     var postgallery = new app.Gallery({
                       id: ell.get("slug")
                     });

                     postgallery.images = ell.get("attachments");

                     postgallery.render();
                   }

                 });

               } // end showMultiPostPage




             }
           },

           gallery: function (type, gallery, soloimg) {
             var cmp = this;


             switch(type) {
             case "post":
               showUnderlyingPage("news");
               boxWith(app.Posts);
               break;
             case "play":
               showUnderlyingPage("plays");
               boxWith(app.Plays);
               break;
             case "press":
               showUnderlyingPage("press");
               boxWith(app.Press);
               break;
             }

             function showUnderlyingPage(which) {
               if (!$("." + which).length) cmp.showpage(which);
             }

             function boxWith(data) {
               if (data.isloaded === true) {
                 photobox();
               }
               else data.on("loaded", function () {
                 photobox();
               });
             }

             function photobox() {
               console.log("you asked for the " + gallery + " " + type + " gallery, specifically image '" + soloimg + "'.");
               var post = _(app.Posts.models).find(function (d) { return d.get("slug") == gallery; });

               var entrees = post.get("attachments");

               app.pb = new app.Photobox({
                 startimg : soloimg,
                 fodder : entrees,
                 postname : gallery,
                 type : type
               });
               app.pb.render();
             }
           },

           splat: function () {
             console.log("splattering");
             this.navigate("", {trigger: true});
           }

         });


         $(window).resize(_.debounce(function () { app.sizefix(); }, 200));

         app.sizefix = function() {
           if ($(".crimage").length) {
             $(".crimage").animate({"left": ($(window).width()-$(".crimage").width())/2 + "px"}, 1000, "easeOutQuad");
             $(".primage p, .nximage p").animate({"margin-top": $(".crimage").height()-50+"px"}, 200);
           }
         };



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
