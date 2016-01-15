require('./iPlayer.js');
/**
  * Use it as a basic player mockup to begin your own player 
  * Rewrite the methods you need.
  *
  * Enjoy!
  *
  * @param t {Telll} The Telll object
  * @class
  * @implements {iPlayer}
  */
MockPlayer = function (t)
{
  this._init (t);
}

MockPlayer.prototype =Object.create(iPlayer.prototype);

/**
 * Event loaded
 * Movie loaded in player
 *
 * @event MockPlayer#loaded
 * @type {Movie}
 */

/**
 * Event timeupdate
 * Time is updated
 *
 * @event MockPlayer#timeupdate
 * @type {integer}
 */

/**
 * Event playing
 * Movie is playing
 *
 * @event MockPlayer#playing
 * @type {integer}
 */

/**
 * Event paused
 * Movie is paused
 *
 * @event MockPlayer#paused
 * @type {integer}
 */



/**
 * _init 
 */
MockPlayer.prototype._init = function (t)
{
    this.t = t;
    this.time = 0;
    if (!this.t.movie) {
        // is this a good feature? Please, comment it if you don't like :)
        telllDialog("Error: movie not selected. Sorry.", 3000);
        this.selectMovie();
    }
    else
    this._showWidget(t);
    this.state = "init";
    this.emit("init", null);
}

/**
 * Private method
 * @param t {Telll} The Telll object
 * @fires MockPlayer#loaded
 */
MockPlayer.prototype._showWidget = function (t)
{
    var me = this;
    var telll = t;
    var movie = t.movie;
    $("<div id='movie-player' class='mock' style='display:none'><div id='mock-buttons'><button class='play'>Play</button><button class='pause'>Pause</button><button class='stop'>Stop</button></div><div id='title-pos'><button class='movie'>Select Movie</button>: "+t.movie.title+"- <b>pos:</b><input id='pos'></div>").appendTo('body');
    //$("<video controls webkit-playsinline src='"+movie.url+"' id='telll-movie' style='width:100%;height:100%;display:none'/>").appendTo("#movie-player");;
    ////////////////////////////////////////////////////////////
    // to work with inline video on iphone see http://apple.co/1VQRL58
    this.video = document.createElement('video');
    this.video.setAttribute('webkit-playsinline', 'true');
    this.video.setAttribute('src', movie.url);
    this.video.setAttribute("id", "telll-movie");
    document.body.appendChild(this.video); // append video to DOM
    ////////////////////////////////////////////////////////////
    $("#telll-movie").appendTo("#movie-player"); // return to jquery
    //$("#telll-movie").attr("webkit-playsinline", true);
    //$("#telll-movie").attr("src", movie.url);
    $('#movie-player .movie').on('click', function (e){me.selectMovie()});
    $('#movie-player .play').on('click', function (e){me.play()});
    $('#movie-player .pause').on('click', function (e){me.pause()});
    $('#movie-player .stop').on('click', function (e){me.stop()});
    //this.video = document.getElementById('telll-movie');
    //this.video.preload = "auto";
    //this.video.controls = true;
    this.loadBehaviors(t);
    this.video.load();
    this.video.play();
    $('#movie-player').fadeIn();
    $('#telll-movie').fadeIn();
}
 /**
 * 
 * @param t {Telll}
 */
MockPlayer.prototype.loadBehaviors = function (t)
{
    var me = this;
    var telll = t;
    var movie = t.movie;
    ///////////////////////////
    // mirror some video events
    this.video.onloadstart = function() {
        me.state = "loaded";
        me.emit('loaded', movie );
       // TODO if it is an iphone do something!!! 
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf('iphone') >= 0){
		// what can i do? :p
        } 
    };
    this.video.onplaying = function() {
       me.state = "playing";
       me.emit('playing', movie );
    };
    this.video.oncanplaythrough = function() {
       telllDialog("Playing: "+movie.url, 2000);
       me.state = "canplaythrough";
       me.emit("canplaythrough", movie );
       me.play();
    }; 
    this.video.ontimeupdate = function(){
        me.timeupdate();
        $('#pos').val(me.time);
    };
    this.video.onpause = function(){
        me.time = me.video.currentTime;
        me.state = "pause";
        me.emit( 'pause', me.time );
    };
    this.video.ended = function(){
        me.time = me.video.currentTime;
        me.state = "ended";
        me.emit( 'ended', me.time );
    };
     ////////////////////////////
};
/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.timeupdate = function ()
{
        this.time = this.video.currentTime;
        this.emit( 'timeupdate', this.time );
};

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.play = function (e, callback)
{
    this.video.play();
    this.state = "playing";
    this.emit("playing", this.time);
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.pause = function (evt, callback)
{
    this.video.pause();
    this.state = "paused";
    this.emit("paused", this.time);
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.stop = function (evt, callback)
{
    this.time = 0;
    this.state = "stop";
    this.emit("stop", this.time);
    this.video.pause();
    this.video.currentTime = 0;
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.seek = function (pos, callback)
{
    this.time = pos;
    this.video.currentTime = pos;
}


/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.selectMovie = function (e, callback)
{
    var me = this;
    var t = me.t;
    this.t.showMoviesList(function (m){
        me.detach();
        me._showWidget(t);
    });
}

/**
* @return null
*/
MockPlayer.prototype.detach = function(){
    //$('div.popup-overlay').detach();
    //$('div.popup').detach();
    $('#movie-player').detach();
    this.state = "detached";
    this.emit("detach", this.time);
};

/**
* @return null
*/
MockPlayer.prototype.atach = function(){
    this._showWidget(this.t);
    this.state = "atached";
    this.emit("atached", this.time);
};




module.exports = {MockPlayer:MockPlayer};
