require ('./iView.js');
/**
* Class: TagPlayer
* 
* It inherits the iView abstract class
*
* @param t {Telll} The Telll object
* @param mp {iPlayer} The movie player as a iPlayer instance
* @listens iPlayer 
* @constructor
*/
function TagPlayer(t, mp){
	if (! mp || mp.error) {
		alert ('Error: TagPlayer not working. Talk with the system administrator, please. '+mp.error)} else {
    this.t = t;
    this.mp = mp;
    this.state = 'new';
    this._init(t);
	}
}

TagPlayer.prototype =Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
* @private
*/
TagPlayer.prototype._init = function(t){
    var me = this;
    this.animations = [];
    this.tag; this.actualPhotolink; this.highlightedPhotolink;
    this.state = "init";
    this.emit('init');
    console.log("Init TagPlayer ...");
    console.log("TagPlayer movie ...", t.movie);
    var mid = parseInt(t.movie.id);
    //console.log("with movie: "+mid);
    //console.log(t.movie);
    //console.log("Init TagPlayer load tags ...");
    this.loadTags(mid, function (theStore){me._showWidget(theStore)});
    console.log("Init TagPlayer behaviors ...");
    this.loadBehaviors();
    console.log("Init TagPlayer  done!!!");
    return null;
};

/**
* @return bool
*/
TagPlayer.prototype.loadBehaviors = function(){
console.log("Sync TagPlayer with Movie Player: !!");
        var me = this;
        var mp = this.t.moviePlayerView;
	mp.on('loaded', function(m){
		console.log('Loaded on TagPlayer: ', m);
		// get trackms for this movie
	});
	mp.on('playing', function(t){
	      console.log('Playing',t);
              console.log( "Show TagPlayer when playing ...");
              console.log( me.state );
              if ( me.state == 'init' || me.state == 'detach'  ){ 
                   console.log( "Show TagPlayer!!!");
                   me.show();
              }
	});
	mp.on('timeupdate', function(t){
		me.handleTag(t);
	});
	/*mp.on('pause', function(t){
		console.log('Paused', t);
                me.pause();
	});
	mp.on('stop', function(t){
		console.log('Stoped', t);
                me.detach();
	});*/
        $(".logo-86x86").addClass("flat");
        $("body").mousemove(function(event){
            me.handleState(function(classe, i){
               if (! $(".logo-86x86").hasClass(classe[i])){
                   $.each(classe, function(tc){
                       $(".logo-86x86").removeClass(classe[tc])
                   }); 
                   $(".logo-86x86").removeAttr("style"); 
                   $(".logo-86x86").addClass(classe[i])
               }
            });
        });
/*
        $('.ppcontrols').on('cssClassChanged', function() {
            console.log("Screen controls changed");
            me.handleState({x:event.pageX,y:event.pageY}, function(classe, i){
               if (! $(".logo-86x86").hasClass(classe[i])){
                   console.log("Screen status moved to: "+ classe[i]);
                   $.each(classe, function(tc){
                       console.log("Screen removing class:",classe[tc])
                       $(".logo-86x86").removeClass(classe[tc])
                   }); 
                   $(".logo-86x86").removeAttr("style"); 
                   $(".logo-86x86").addClass(classe[i])
               }
            });
        });
*/
        console.log("TagPlayer sync: done!!!");
        return null;
};

/** 
 * Telll movie player has 4 possible screen status:
 *
 * - flat: movie controls and panel closed
 * - controls: movie controls opened and panel closed
 * - panel: movie controls closed and panel opened
 * - controls-panel: movie controls and panel opened
 *
 * @param cb {Function} Callback
 */
TagPlayer.prototype.handleState = function(cb) {
        setTimeout(function(){
        var classe = ["flat","controls","panel","controls-panel"];
        var state = {controls:"closed",panel:"closed"};
        var i = 0 ;
        // See the screen status and return the class to be applyed
        // TODO .ppcontrols is the control from PRJK, what about mockPlayer ?
        if ($(".ppcontrols").hasClass("active")){ state.controls = "opened" }
        else if ($(".ppcontrols").hasClass("inactive")){ state.controls = "closed" }
        if ($("#photolinks-list-widget").hasClass("active")){ state.panel = "opened" }
        else if ($("#photolinks-list-widget").hasClass("inactive")){ state.panel = "closed" }
        if (state.controls == "closed" && state.panel == "closed") i = 0;
        if (state.controls == "opened" && state.panel == "closed") i = 1;
        if (state.controls == "closed" && state.panel == "opened") i = 2;
        if (state.controls == "opened" && state.panel == "opened") i = 3;
        if (cb) cb(classe, i);
        }, 200);
};

/**
 *
 * @param mid {Integer} The movie id 
 * @param cb {function} callback
 * @return bool
 */
TagPlayer.prototype.loadTags = function(mid, cb){
    t = this.t;
    me = this;
    console.log("TagPlayer.loadTags: loading photolins and tracks for movie "+mid); 
    t.getPhotolinksOfMovie(mid, function(pl, rid){
       console.log("    The movie photolinks");
       console.log("    with movie: "+rid);
       console.log(pl);
       me.list = t.store.photolinks = pl.photolinks;
       console.log("TagPlayer.loadTags: call t.getTracks ..."); 
       t.getTracks(rid, function(e, d){
             console.log("Callback from telll.getTracks from TagPlayer init ... ");
	     console.log(d);
             if (e) { 
                 alert (e.message);
                 throw(e.message);
             }
             me.tags = t.store.tags = d.trackmotions.concat(t.store.tags);
             me.state = "loaded";
             me.emit('loaded');
             //t.store.tags = me.list.concat(t.store.tags); 
             console.log("TagPlayer: the store", t.store);
             console.log("TagPlayer: the list", me.list);
             t.store.getLabel = function(){
                 var label = "Telll Photolink";
                 //console.log("Label:");
                 //console.log(this);
                 //console.log(me.list);
                 //console.log("TagPlayer: the store",t.store);
                 t.store.photolinks.forEach(function(p){
                       //console.log(p);
                       if (p.photolink.id == this.photolink ) label = p.photolink.title;
                 });  
                 return label;
             }    
             t.store.getImage = function(){
                 var src  = "img/tag_default.png";
                 t.movie.photolinks.forEach(function(p){
                       if (p.photolink.id == this.photolink ) src = p.thumb;
                 });  
                  return src; 
             }
             if (cb) cb(t.store);
             console.log("TagPlayer: loading photolins and tracks done getPhotolinks!! "); 
       });
       console.log("TagPlayer: loading photolins and tracks done getTracks!! "); 
    });
    console.log("TagPlayer: loading photolins and tracks done!! "); 
};

/**
 * Needs to load tags ans photolinks in store first
 * @return bool
 */
TagPlayer.prototype.show = function(){
    console.log("Showing TagPlayer widget ...");
    this.t.store.getLabel = function () {
         var label = "Telll Photolink";
/*
         if (this.t.store.photolinks)
         this.t.store.photolinks.forEach(function(p){
               if (p.photolink.id == this.photolink ) label = p.photolink.title;
         });
*/
         return label;
     }
     this.t.store.getImage = function () {
         var src  = "img/tag_default.png";
/*
         if (this.t.movies.photolinks)
         this.t.store.photolinks.forEach(function(p){
               if (p.photolink.id == this.photolink ) src = p.thumb;
         });
*/
         return src;
     }
    this._showWidget(this.t.store);
    this.animations.forEach(function(a){
        a.resume();
    });
    this.viewMode("none"); 
}; 

/**
 * @return bool
 */
TagPlayer.prototype.pause = function(){
    console.log("TagPlayer widget paused ...");
    this.animations.forEach(function(ttimer){
        ttimer.pause();
    });
    if (this.state == "show") this.detach();
}; 


/**
 * @return bool
 */
TagPlayer.prototype.detach = function(){
    console.log("Detaching TagPlayer widget ...");
    //throw("See!!!");
    $("div#telll-tag-player-widget").remove();
    $("#tag-player-css").remove();

    //$(".tag").detach();
    this.state = "detach";
    this.emit("detach" );
}; 


/**
 *
 * @param data {} 
 * @return bool
 */
TagPlayer.prototype._showWidget = function(store){
    console.log("Running to show TagPlayer ...");
    var tmpl = require('./templates/tagplayer.mtjs');
    var html = Mustache.render(tmpl.html, store);
    if (tmpl.css)
    $('<style id="tag-player-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    this.state = "show";
    this.emit("show", html );
    console.log("Showing TagPlayer widget done!!!...");
    return true;
};

/**
* @param mp {iPlayer} The movie player to sync 
* @param cb {} The callback
* @return bool
TagPlayer.prototype.follow = function(){
        console,log("TagPlayer sync: Movie");
        console.log(telll.movie);
        this.t.syncPlayer(this, mp, cb);
	var telll = this.t;
	var me = this;
	telll.getTracks(telll.movie, function(e, d){
             console.log("Callback from tell.getTracks from TagPlayer.sync ... ");
	     console.log(e);
	     console.log(d);
             if (e) alert (e.message);
             throw(e.message);
             me.state = "loaded";
             me.emit('loaded');
	});

	mp.on('loaded', function(m){
		console.log('Loaded on TagPlayer: ', m);
		// get trackms for this movie
	});
	mp.on('playing', function(t){
		console.log('Playing',t);
	});
	mp.on('timeupdate', function(t){
		console.log('timeupdate', t);
	});
	mp.on('paused', function(t){
		console.log('Paused', t);
	});
	mp.on('stoped', function(t){
		console.log('Stoped', t);
	});
        console,log("TagPlayer sync: done!!!");
        return null;
};
*/
/**
* @return null
*/
TagPlayer.prototype.scrollPhotolinksPanel = function(){
  console.log('Implement method scrollPhotolinksPanel');
};

/**
* @return null
*/
TagPlayer.prototype.flashIcon = function(){
  console.log('Implement method flashIcon');
};


/** 
* @param mode {String} default or none
* @return null
*/
TagPlayer.prototype.viewMode = function(mode){
    console.log("Seting viewMode to: " + mode );
    if ( mode == "default" )$("#telll-tag-player-widget").addClass("tgp-default").removeClass("tgp-none");
    if ( mode == "none" )$("#telll-tag-player-widget").addClass("tgp-none").removeClass("tgp-default");
    return null
}



/**
* @return null
*/
TagPlayer.prototype.getTracks = function(){
  console.log('Implement method getTracks');
};

/**
* @return null
*/
TagPlayer.prototype.playTrackms = function(p1, p2){
  console.log('Playing tag', this.tag);
  var me = this;
  // TODO its suposed to be in css ... hmmmm
  $("#telll-tag-player-widget").css({
      "overflow":"hidden",
      "width": "200px",
      "height":"120px",
      "position": "absolute",
      "top" :"100px",
      "z-index": 99999999,
      /*"opacity":0.5,*/
      "background": "white"
  });
  // it a widget but we want to avoid some behaviors ... :)
  $("#telll-tag-player-widget").removeClass("telll-widget");
  $('.tag').removeClass('tag-none');
  $('.tag').removeClass('tag-flash');
  $('.tag').removeClass('tag-yellow');
  $('.tag').addClass('tag-default');

  // show the actual tag

  /**
  * begin the animation
  */
  me.viewMode("none");
  var animation = new telllTimer( function(){
      //$("#telll-tag-player-widget").fadeOut();
      me.viewMode('none');
      //$('.tag').removeClass('tag-default');
      //$('.tag').removeClass('tag-flash');
      //$('.tag').removeClass('tag-yellow');
      //$('.tag').addClass('tag-none');
      //me.detach();
      me.t.store.tags[i].stopped = 1;
      console.log('TagPlayer Stoping tag', me.tag);
  }, 1000 * (p2 - p1));
  console.log(animation);
  this.animations.push( animation );
  for (var i=0; i<this.tag.points.length-1; i++){
       var pt = this.tag.points[i];  //this point
       var xpt= this.tag.points[i+1];//next point
       var mp = me.t.movie.time;     //movie position
       if (pt.t < mp ){
            if (i == this.tag.points.length-2){
                me.animTag(pt.x, pt.y, xpt.x, xpt.y, 0, xpt.t-mp, this.tag.photolink,true);
            } else {
                me.animTag(pt.x, pt.y, xpt.x, xpt.y, 0, xpt.t-mp, this.tag.photolink, false);
            }
       } else {
            if (i == this.tag.points.length-2){
                me.animTag(pt.x, pt.y, xpt.x, xpt.y, pt.t-mp, xpt.t-pt.t, this.tag.photolink, true);
            } else {
                me.animTag(pt.x, pt.y, xpt.x, xpt.y, pt.t-mp, xpt.t-pt.t, this.tag.photolink, false);
            }
       }
  }
};

/** animTag
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param tout
 * @param time
 * @param plId
 * @param last
**/
//var animT = [];
TagPlayer.prototype.animTag = function (x1, y1, x2, y2, tout, time, plId, last){
     console.log("Animating tag ...");
     var me = this;
     // using miliseconds
     tout = tout*1000;
     time = time*1000;

     vOffset = $('video').offset();
     vWidth  =  $('video').width();
     vHeight =  $('video').height()
     x1=Math.round(vWidth*x1/100+vOffset.left);
     x2=Math.round(vWidth*x2/100+vOffset.left);
     y1=Math.round(vHeight*y1/100+vOffset.top);
     y2=Math.round(vHeight*y2/100+vOffset.top);
     console.log("Animating tag begin ...");
     console.log(me.t.store.photolinks, plId);
     var myPl = me.t.store.photolinks[plId];

     console.log("Animating tag going ...", myPl);
     $('div#telll-tag-player-widget').css({'left':x1,'top':y1});
     $('div#telll-tag-player-widget').css({'width':'20%','height':'18%'});
     //$('div#telll-tag-player-widget').fadeIn();

     $('div#telll-tag-player-widget').animate({
           'left':x2,
           'top':y2,
     },time,function(){
           // done

     });
     console.log("Animating tag ended ...");
};

/*     var handle = setTimeout (function(t){
          // Create the tag if it doesn't exist
          if( !$('#pl-'+plId).length ){
            //$("body").append('<div id="pl-'+plId+'" class="tag tag-none"><div class="clkbl"><div class="tag-label"><a target="_blank" href="'+myPl.links[0].url+'">'+myPl.links[0].title+'</a></div></div></div>');
            $("body").append('<div id="pl-'+plId+'" class="tag tag-none"><div class="clkbl"><div class="tag-label">'+myPl.links[0].title+'</div></div></div>');
            $('#pl-'+plId).css({'left':x1,'top':y1});
            $('#pl-'+plId).css({'width':'20%','height':'18%'});
            $('#pl-'+plId).fadeIn();

            // When double clicked -> Dialog with link
            //$('#pl-'+plId+' *').dblclick(function (e) {
            $('#pl-'+plId+' *').doubletap(function (e) {
    console.log('Double Click!!!');
            me.t.moviePlayerView.pause();
                // show dialog with photolinked webpage
    	    $('body').append('<div id="ph-dialog-'+plId+'"><iframe width="100%" height="100%" src="/cgi-bin/mirror.pl?url='+myPl.links[0].url+'"></div>');
*/

/*    	    $( "#ph-dialog-"+plId ).dialog({
    	           modal: true,
                       width: '80%',
                       height: theHeight - 5,
                       title: myPl.links[0].title,
    	           buttons: {
    	    	 Close: function() {
    	    	   $( this ).dialog( "close" );
    	    	 }
    	           }
    	    });
                $( "#ph-dialog-"+plId ).dialog( "open" );
*/
/*
                telllPopup($( "#ph-dialog-"+plId ) );
    	},
            // When single clicked -> Send photolink
            //$('#pl-'+plId+' *').click(
            function (e) {
    console.log('Single Click!!!');
                //sendPhotolink(plId);
    	},400);
          } // Tag created. Animate it!
*/
          //$('#pl-'+plId).animate({

/*
      },tout);

      // save timeout at stack
      animT.push(handle);
      // if it's the last animation fadeout after done
      handle = setTimeout (function(t){
          if(last) $('#pl-'+plId).fadeOut(200,function(){});
      },tout+time);
      animT.push(handle);
};
*/






/**
* Traverse the tags to find a trackmotion begining to play now
* Register the tag found and play it
* 
* #param t {Integer}
* @return bool
*/
TagPlayer.prototype.handleTag = function(t){
        for (var i = 0; i < this.t.store.tags.length; i++) {
          var p2 = this.t.store.tags[i].points[0].t;
          var p1 = p2;
          for (var j = 0; j < this.t.store.tags[i].points.length; j++) {
             var tp = this.t.store.tags[i].points[j].t;
             if (tp > p2) p2 = tp;
             if (tp < p1) p1 = tp;
          }
          if (t >= p1 && t <= p2) { // It's playing now!
            this.tag = this.t.store.tags[i];
            if (this.t.store.tags[i].stopped) {
		  console.log("PLAYTAG");
              this.t.store.tags[i].stopped = 0;
              // scroll photolink panel to here
              this.actualPhotolink = this.t.store.tags[i].photolink;
	      this.emit("tag", actualPhotolink );
              this.scrollPhotolinksPanel(this.actualPhotolink - this.highlightedPhotolink);
              this.playTrackms(p1,p2); // animate tag
              this.tagWarn(parseInt((p2 - p1)*1000)); // warn the user that have a tag here
            }
          } else {
            this.t.store.tags[i].stopped = 1;
          }
        }
        return null;
};

/** 
* the telll logo button is allways in the titlebar.
* on called tagWarn the logo comes to body for time 
* @param time {Integer} in milisseconds
*/
TagPlayer.prototype.tagWarn = function (time) {
    var myPlace = $('.logo-86x86').parent();
    console.log("Append to body ",$("body"),"From ", myPlace);
    //verify if it still is in the body
   if (($("body")[0] != myPlace[0]  )){
    $('.logo-86x86').appendTo("body");
    $('.logo-86x86').css({position:"absolute","z-index":9999999999999});
    $(".logo-86x86").fadeIn(100, function() {
        setTimeout(function() {
            console.log("Append to bar: ",myPlace);
            if ( ( myPlace && $("body")[0] != myPlace[0] ) ) {
              myPlace.append($(".logo-86x86"));
              $(".logo-86x86").removeAttr("style").hide();
            } else { console.log("Still in the bar!!!");}
        }, time);
    });
    } else { console.log("Still in the body!!!");
    }
}

/**
* @return null
*/

TagPlayer.prototype.attach = function(){
  console.log('Implement method attach');
};
/**
* @return null
*/
TagPlayer.prototype.open = function(){
  console.log('Implement method open');
};

/**
* @return null
*/
TagPlayer.prototype.close = function(){
  console.log('Implement method close');
};


module.exports = {TagPlayer:TagPlayer};
