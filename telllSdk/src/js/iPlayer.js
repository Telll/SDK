const util = require('util');
const EventEmitter = require('events');
/**
  * class iPlayer
  * @interface 
  */
iPlayer = function ()
{
  this._init ();
}
/**
 * Event loaded
 * Movie loaded in player
 *
 * @event iPlayer#loaded
 * @type {Movie}
 */

/**
 * Event timeupdate
 * Time is updated
 *
 * @event iPlayer#timeupdate
 * @type {integer}
 */

/**
 * Event playing
 * Movie is playing
 *
 * @event iPlayer#playing
 * @type {integer}
 */

/**
 * Event paused
 * Movie is paused
 *
 * @event iPlayer#paused
 * @type {integer}
 */



iPlayer.prototype._init = function ()
{
    EventEmitter.call(this);
    this.state = "stoped"; 
}

util.inherits(iPlayer, EventEmitter);

/**
 * 
 * @param movie
    *      
 */
iPlayer.prototype.play = function (movie)
{
   this.state = "playing"; 
}


/**
 * 
 */
iPlayer.prototype.stop = function ()
{
   this.state = "stoped"; 
}

/**
 * 
 */
iPlayer.prototype.pause = function ()
{
   this.state = "paused"; 
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

