// telll SDK
// by Monsenhor filipo@kobkob.org
// license GPL Affero 3.0

VERSION = "0.16.0";
//console.log('telllSDK javascript by Monsenhor, Version: '+VERSION);
var devMode = false;
if (location.hostname == "127.0.0.1" && location.port == "9966") devMode = true;

// Load jQuery
$ = require('jquery');
jQuery = $;
// Load mustache
Mustache = require('mustache');

// Apply some jQuery plugins
(function($){
/*
 * jQuery FxQueues 2.1
 * Copyright 2009, 2010 Luciano German Panaro <contact@decodeuri.com>
 * Released under the MIT and GPL licenses.
 */
  var fxQueue = function(queueName) {
    return {
      name: queueName,

      isFxQueue: true,

      paused: false,

      playing: null,

      shouldStart: function() {
          return (this.playing == null || !this.paused);
      },

      pause: function() {
          if (!this.playing) { return false; }
          ((this.playing.isScope)? this.playing: this.playing.elem).stop();
          this.paused = true;
          return true;
      },

      stop: function() {
          if (!this.playing) { return false; }
          ((this.playing.isScope)? this.playing: this.playing.elem).stop();
          this.playing = null;
          this.paused = false;
          this.length = 0;
          return true;
      },

      start: function() {
          // if a dequeued fn was paused
          if (this.playing && this.paused) {
              this.playing();
              this.paused = false;
              return true;
          // or if the queue has not started
          } else if (this.length && !this.playing) {
              this.playing = this[0];
              $(document).dequeue(this.name);
              return true;
          }
          return false;
      },

      getScope: function( scopeName ) {
          if (this.playing && this.playing.isScope && this.playing.called == scopeName) {
              return this.playing;
          }

          for (var i = 0; i < this.length; i++) {
              if (this[i].isScope && this[i].called == scopeName) {
                  return this[i];
              }
          }
          return false;
      },

      dequeue: function( caller ) {
          // Do nothing if queue is not playing anything
          if (!this.playing) {
            return false;
          }

          if (this.playing.isScope) {

              var queueItems = this.playing.items;
              // Find the actual element in scope's items
              for ( var i=0; i < queueItems.length; i++) {
                  if ( caller == queueItems[i].elem[0] && !queueItems[i].finished ) {
                      queueItems[i].finished = true;
                      this.playing.finishedItems++;
                  }
              }

              // Do not dequeue if scope is not finished
              if (this.playing.finishedItems < queueItems.length) {
                  return false;
              }

          // Dequeue just once for every selection
          } else if (this.playing.elem && this.playing.elem[0] != caller) {
              return false;
          }

          var queue = this;

          setTimeout(function() {
              queue.playing = queue[0];
              $(document).dequeue(queue.name);
          }, this.playing.postDelay);

          return true;
      }

    };

  };

  var fxScope = function ( scopeName ) {
      var newScope = function() {
          for (var i=0; i < newScope.items.length; i++) {
              newScope.items[i]();
          }
      };
      newScope.called = scopeName;
      newScope.isScope = true;
      newScope.finishedItems = 0;
      newScope.stop = function() {
          for (var i=0; i < newScope.items.length; i++) {
              newScope.items[i].elem.stop();
          }
      };
      newScope.items = [];
      return newScope;
  };

  // We need to overload the default animate method
  var _animate = $.fn.animate;

  $.fn.animate = function( props, speed, easing, callback ) {
      if (!this.length) {
          return this;
      }

      var options = (typeof speed == "object")? speed: $.speed(speed, easing, callback);

      // Load in the default options
      var opts = $.extend({
          queue: "fx",
          position: "end",
          limit: -1,
          preDelay: 0,
          postDelay: 0,
          complete: null
      }, options );

      // Let normal animations just pass through
      if ( !opts.queue || opts.queue == "fx" ) {
          return _animate.apply( this, arguments );
      }

      // Get the name of the queue
      var queueName = opts.queue;

      // Get the effect queue (A global queue is centered on 'document')
      var queue = $(document).queue( opts.queue );

      // Queue initialization
      if ( queue.length == 0 && !queue.isFxQueue ) {
          $(document).queue( queueName, [] ); //initialize queue
          queue = $(document).queue( queueName ); //get the new queue
          $.extend(queue, fxQueue(queueName)); //extend with fxQueue
      }

      // We're overriding the default queueing behavior
      opts.queue = false;

      // The animation to queue
      var fn = function() {
          opts.complete = function() {
              queue.dequeue(this);
              if ( $.isFunction(fn.users_complete) ) {
                  return fn.users_complete.apply(this, arguments);
              }
          };
          setTimeout(function() {
              fn.elem.animate( props, opts );
          }, fn.preDelay);
      };
      fn.elem = this;
      fn.preDelay = opts.preDelay || 0;
      fn.postDelay = opts.postDelay || 0;
      fn.users_complete = speed.complete || callback; //Do not use the one generated by $.speed

      // If scope exists, just add the animation and return
      var scope = queue.getScope( opts.scope );
      if ( scope ) {
          scope.items.push( fn );
          // Start the animation if the scope is already being played
          if (queue.playing == scope) {
              fn();
          }
          return this;
      }

      // Restrict the animation to a specifically sized queue
      if ( opts.limit < 0 || queue.length < opts.limit) {

          var add = null; //What we are going to add into the queue
          if ( opts.scope ) {
              add = fxScope( opts.scope );
              add.items.push(fn);
          } else {
              add = fn;
          }

          if ( opts.position == "end" ) {
            queue.push( add );
          } else if ( opts.position == "front" ) {
            queue.splice( 1, 0, add );
          }

          if ( queue.shouldStart() ) {
            queue.start();
          }

          return this;
      }
  };

  // A simple global fx queue getter
  $.extend({
      fxqueue: function(queueName) {
          return $(document).queue( queueName );
      }
  });

  $.fxqueue.version = "2.1";


  // Create event to listen when jquery changes a class
  // We need that to trigger the projekktor toolbar and reposition the warn tool
  var originalAddClassMethod = $.fn.addClass;
  $.fn.addClass = function() {
    var result = originalAddClassMethod.apply(this, arguments);
    // trigger a custom event
    $(this).trigger('cssClassChanged');
    return result;
  };

  // Create the doubletap method
  // based on http://appcropolis.com/blog/howto/implementing-doubletap-on-iphones-and-ipads/
  $.fn.doubletap = function(onDoubleTapCallback, onTapCallback, delay) {
    var eventName, action;
    delay = delay === null ? 500 : delay;
    eventName = isiOS === true || isAndroid === true ? 'touchend' : 'click';

    $(this).on(eventName, function(event) {
      var now = new Date().getTime();
      /** the first time this will make delta a negative number */
      var lastTouch = $(this).data('lastTouch') || now + 1;
      var delta = now - lastTouch;
      clearTimeout(action);
      if (delta < 500 && delta > 0) {
        if (onDoubleTapCallback !== null && typeof onDoubleTapCallback == 'function') {
          event.preventDefault();
          onDoubleTapCallback(event);
        }
      } else {
        $(this).data('lastTouch', now);
        action = setTimeout(function(evt) {
          if (onTapCallback !== null && typeof onTapCallback == 'function') {
            event.preventDefault();
            onTapCallback(event);
          }
          clearTimeout(action); // clear the timeout
        }, delay, [event]);
      }
      $(this).data('lastTouch', now);
    });
    return this;
  };
})(jQuery);
///////////////////////////////////////////////////



// create the object telllSDK
/**
 * The main Telll module object
 * @module telllSDK
 */
telllSDK = {};
telllSDK = require('./Telll.js');
/**
 * The main TWS module object
 * @module telllSDK.TWS
 */
telllSDK.TWS = {};
telllSDK.TWS = require('./Tws.js').TWS;
telllSDK.CWS = require("./CommandWS.js");
telllSDK.View = {};
telllSDK.TWS.User = require('./User.js').User;
telllSDK.TWS.Device = require('./Device.js').Device;
telllSDK.TWS.Movie = require('./Movie.js').Movie;
telllSDK.TWS.Trackms = require('./Trackms.js').Trackms;
telllSDK.TWS.Photolink = require('./Photolink.js').Photolink;
telllSDK.View.Login = require('./Login.js').Login;
telllSDK.View.TagPlayer = require('./TagPlayer.js').TagPlayer;
telllSDK.View.PhotolinksList = require('./PhotolinksList.js').PhotolinksList;
telllSDK.View.MoviesList = require('./MoviesList.js').MoviesList;
telllSDK.View.Clickbox = require('./Clickbox.js').Clickbox;
telllSDK.View.TelllBtn = require('./TelllBtn.js').TelllBtn;
telllSDK.View.Dashboard = require('./Dashboard.js').Dashboard;
telllSDK.View.TelllPlayer = require('./TelllPlayer.js').TelllPlayer;
telllSDK.View.MockPlayer = require('./MockPlayer.js').MockPlayer;
telllSDK.View.TagEditor = require('./TagEditor.js').TagEditor;
telllSDK.View.YoutubePlayer = require('./YoutubePlayer.js').YoutubePlayer;

/**
 * Provides requestAnimationFrame/cancelRequestAnimation in a cross browser way.
 * from paul irish + jerome etienne
 * - http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * - http://notes.jetienne.com/2011/05/18/cancelRequestAnimFrame-for-paul-irish-requestAnimFrame.html
 */

if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( callback, element ) {
			return window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}
if ( !window.cancelRequestAnimationFrame ) {
	window.cancelRequestAnimationFrame = ( function() {
		return window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		clearTimeout
	} )();
}

// load default css
var tmpl = require('./templates/default.mtjs');
if (tmpl.css)
$('<style id="default-css">'+tmpl.css+'</style>').appendTo('head');

///////////////////////////
/**
 * Util widgets and plugins
 * @ module telllSDK.util
 */

/**
 * Telll Dialog
 * @function telllDialog
 * @param msg {String} The message
 * @param delay {integer} The delay
 * @global
 */
telllDialog = function(msg, delay){
    $("<div class='telll-dialog'>"+msg+"</div>").appendTo("body").fadeIn(function(){
        setTimeout(function(){
             $(".telll-dialog").fadeOut(function(){$(".telll-dialog").detach();})
        }, delay);
    });
};

/** 
 * Telll Modal Popup
 * @function telllPopup
 * @param element {JQuery} The Jquery object to embbed in popup
 * @param title {string} The popup title, defaults to "telll"
 * @return {String} the unique class name
 * @global
 */
telllPopup = function(element, title){
    var idPopup = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 30; i++ )
        idPopup += possible.charAt(Math.floor(Math.random() * possible.length));
 
    if (!title) title = "telll";
    $('<div id="'+idPopup+'-overlay" class="overlay"></div>').appendTo('body');
    $('<div id='+idPopup+' class="telll-popup popup"><div class="popup-titlebar widget-titlebar"><div class="logo-86x86"></div><span class="title">'+title+'</span><button class="close">Close</button></div></div>').append(element).appendTo('body').fadeIn();
    $('.telll-popup').css('z-index','999');
    $('html').addClass('overlay');
    $('#'+idPopup+' div.popup-titlebar .close').on('click', function(){
        $('#'+idPopup+'-overlay').remove();
        $('#'+idPopup).remove();
    });
    return idPopup;
}

/** 
 * TelllTimer
 * @function telllTimer
 * @param element {JQuery} The Jquery object to embbed in popup
 * @param title {string} The popup title, defaults to "telll"
 * @global
 */
telllTimer = function (fn, countdown) {
    console.log("New telllTimer ...");
    var ident, complete = false;
    function _time_diff(date1, date2) {
        return date2 ? date2 - date1 : new Date().getTime() - date1;
    }

    function cancel() {
        clearTimeout(ident);
    }

    function pause() {
        clearTimeout(ident);
        total_time_run = _time_diff(start_time);
        complete = total_time_run >= countdown;
    }

    function resume() {
        ident = complete ? -1 : setTimeout(fn, countdown - total_time_run);
    }

    var start_time = new Date().getTime();
    ident = setTimeout(fn, countdown);

    return { cancel: cancel, pause: pause, resume: resume };
}

if (devMode) exampleImplementation();

/* Example */
function exampleImplementation (){
console.log('Loading example implementation ...');

myAdTest = new telllSDK.Telll();
console.info('telll: ', myAdTest);
// We may do it for a simplest aproach
// myAdTest.start();

// Detect if local machine is off line each 3600 seconds
setInterval( function(){
 $.ajax({
   type: "GET",
   cache: null,
   url: "http://"+myAdTest.conf.host+"/ws"
 }).fail( function() {
   alert('Connection seems down! Please check your Internet.');
 });
},3600000);



// After login create the buttons
myAdTest.login(null, function(){
    // define the instance player
    var myPlayer = {"error":"Player not loaded!!!"};
    // create buttons
    $('<input type="button" value="Dashboard">').appendTo('body').on('click', function(){myAdTest.showDashboard()});
    $('<input type="button" value="Clickbox">').appendTo('body').on('click', function(){myAdTest.showClickbox()});
    $('<input type="button" value="Movies List">').appendTo('body').on('click', 
	    function(){
            // showMoviesList runs the callback after a movie is selected
		    myAdTest.showMoviesList(function(m){
                        console.log("Movie selected: "+m.getTitle());
                        console.log(m);
                    })
	    });
   $('<input type="button" value="Mock Player">').appendTo('body').on('click', 
	   function(){
            // showMockPlayer runs the callback after load
		   myAdTest.showMockPlayer( function(m){
                       myPlayer = m;       
		       console.log(m); 
		   })
	   });
    $('<input type="button" value="Telll Movie Player">').appendTo('body').on('click', function(){myAdTest.showMoviePlayer()});
    $('<input type="button" value="Youtube Player">').appendTo('body').on('click', function(){myAdTest.showYoutubePlayer()});
    $('<input type="button" value="Tag Player">').appendTo('body').on('click', 
	   function(){
            // showTagPlayer runs the callback after load
	           myAdTest.showTagPlayer( myPlayer, function(tp){ 
                           console.log(tp);
	           }) 
	   });
    $('<input type="button" value="Photolinks List">').appendTo('body').on('click', function(){
	    var list = myAdTest.showPhotolinksList();
	    setTimeout(function(){
	    console.log(list);
	    list.on("open", function(pl){
	        console.log("PL :", pl);
	    });},200);
    });
    $('<input type="button" value="Telll Button">').appendTo('body').on('click', function(){myAdTest.showTelllBtn()});
 
});

}
