require('./iPlayer.js');
/**
  * class MockPlayer
  * Use it as a basic player mockup to begin your own player 
  * Rewrite the methods you need.
  * @constructor
  */
MockPlayer = function (t)
{
  this._init (t);
}

MockPlayer.prototype =Object.create(iPlayer.prototype);

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
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype._showWidget = function (t)
{
    var me = this;
    var telll = t;
    var movie = t.movie;
    $("<div id='movie-player' style='display:none'><video src="+movie.url+" id='telll-movie' style='width:100%;height:100%;display:none'/><button class='movie'>Select Movie</button><button class='play'>Play</button><button class='pause'>Pause</button><button class='stop'>Stop</button><div id='title-pos'>telll MockPlayer: "+t.movie.title+"- <b>pos:</b><input id='pos'></div>").appendTo('body');
    $('#movie-player .movie').on('click', function (e){me.selectMovie()});
    $('#movie-player .play').on('click', function (e){me.play()});
    $('#movie-player .pause').on('click', function (e){me.pause()});
    $('#movie-player .stop').on('click', function (e){me.stop()});
    this.video = document.getElementById('telll-movie');
    this.video.preload = "auto";
    this.video.controls = true;
    this.video.onloadstart = function() {
        me.state = "loaded";
        me.emit('loaded', movie );
        $('#movie-player').fadeIn();
        $('#telll-movie').fadeIn();
    };
    this.video.oncanplaythrough = function() {
       telllDialog("Playing: "+movie.url, 2000);
       me.play();
    }; 
    this.video.ontimeupdate = function(){
        me.time = me.video.currentTime;
        me.emit( 'timeupdate', me.time );
        $('#pos').val(me.time);
    };
}
 
/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.play = function (e, callback)
{
    this.state = "playing";
    this.emit("playing", this.time);
    this.video.play();
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.pause = function (evt, callback)
{
    this.state = "paused";
    this.emit("pause", this.time);
    this.video.pause();
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.stop = function (evt, callback)
{
    this.time = 0;
    this.state = "stoped";
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
    this.status = "detached";
    this.emit("detach", this.time);
};




module.exports = {MockPlayer:MockPlayer};
