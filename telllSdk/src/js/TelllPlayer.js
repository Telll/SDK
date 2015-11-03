require('./iPlayer.js');
/**
  * class TelllPlayer
  * 
  */
TelllPlayer = function (t)
{
  this._init (t);
}

TelllPlayer.prototype =Object.create(iPlayer.prototype);

/**
 * _init sets all TelllPlayer attributes to their default value. Make sure to call
 * this method within your class constructor
 */
TelllPlayer.prototype._init = function (t)
{
  this.t = t; 
  //iPlayer.prototype._init.call(this, $div, data);
  $('body').append("<h1>TelllPlayer - implement me!!!!</h1>");
}

/**
 * 
 * @param event
 * @param callback
    *      
TelllPlayer.prototype.on = function (evt, callback)
{
  this.me[0].addEventListener(evt, callback);
}
 */


module.exports = {TelllPlayer:TelllPlayer};

