require('./iPlayer.js');

/**
  * class MockPlayer
  * 
  */
MockPlayer = function ($div, data)
{
  this._init ($div,data);
}

MockPlayer.prototype = new iPlayer ();

/**
 * _init sets all MockPlayer attributes to their default value. Make sure to call
 * this method within your class constructor
 */
MockPlayer.prototype._init = function ($div, data)
{
  this.me = $div; 
  //iPlayer.prototype._init.call(this, $div, data);
  $div.append("<h1>MockPlayer</h1>");
}

/**
 * 
 * @param event
 * @param callback
    *      
MockPlayer.prototype.on = function (evt, callback)
{
  this.me[0].addEventListener(evt, callback);
}
 */
