require('./iPlayer.js');
/**
  * class MockPlayer
  * It' s only a time counter 
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
    me = this;
    
    $('body').append("<div id='movie-player'><button class='movie'>Select Movie</button><button class='play'>Play</button><button class='pause'>Pause</button><button class='stop'>Stop</button></div>");
    $('#movie-player .movie').on('click', function (e){me.selectMovie()});
    $('#movie-player .play').on('click', function (e){me.play()});
    $('#movie-player .pause').on('click', function (e){me.pause()});
    $('#movie-player .stop').on('click', function (e){me.stop()});
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.play = function (e, callback)
{
    me = this;
    this.playing = setInterval (function (t){
        me.time ++; 
        //console.log(me.time);
        me.emit( 'changeTime', me.time );
    }, 100);
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.pause = function (evt, callback)
{
    clearTimeout(this.playing);
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.stop = function (evt, callback)
{
    clearTimeout(this.playing);
    this.time = 0;
}

/**
 * 
 * @param error
 * @param callback
 */
MockPlayer.prototype.selectMovie = function (e, callback)
{
    me = this;
    if (!this.t.movie) {
        alert('Please, select a movie first.');
        this.t.showMoviesList(function (d){console.log('MOvies Listt');});
    }

}




module.exports = {MockPlayer:MockPlayer};
