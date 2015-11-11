const util = require('util');
const EventEmitter = require('events');
/**
  * class iPlayer
  * 
  */

iPlayer = function ()
{
  this._init ();
}

iPlayer.prototype._init = function ()
{
    EventEmitter.call(this);
    this.state = "STOPPED"; 
}

util.inherits(iPlayer, EventEmitter);

/**
 * 
 * @param movie
    *      
 */
iPlayer.prototype.play = function (movie)
{
   this.state = "PLAYING"; 
}


/**
 * 
 */
iPlayer.prototype.stop = function ()
{
   this.state = "STOPPED"; 
}

/**
 * 
 */
iPlayer.prototype.pause = function ()
{
   this.state = "PAUSED"; 
}



/**
 * 
 * @param movie
    *      
 */
iPlayer.prototype.load = function (movie)
{
    this.movie = movie;
    this.loaded = true; 
}


/**
 * 
 * @param go_to_seconds
    *      
 */
iPlayer.prototype.seek = function (go_to_seconds)
{
 this._actualSeconds = go_to_seconds; 
}


/**
 * 
 */
iPlayer.prototype.actualSeconds = function ()
{
  return this._actualSeconds;
}


/**
 * 
 * @param new_volume
    *      
 */
iPlayer.prototype.volume = function (new_volume)
{
  
}

/**
 * 
 * @param event
 * @param callback
    *      
iPlayer.prototype.on = function (evt, callback)
{
  this.me[0].addEventListener(evt, callback);
}
 */



