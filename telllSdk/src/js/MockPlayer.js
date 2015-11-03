require('./iPlayer.js');
/**
  * class MockPlayer
  * 
  */
MockPlayer = function (t)
{
  this._init (t);
}

MockPlayer.prototype =Object.create(iPlayer.prototype);

/**
 * _init sets all MockPlayer attributes to their default value. Make sure to call
 * this method within your class constructor
 */
MockPlayer.prototype._init = function (t)
{
  this.t = t; 
  //iPlayer.prototype._init.call(this, $div, data);
  $('body').append("<h1>MockPlayer - implement me!!!!</h1>");
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


module.exports = {MockPlayer:MockPlayer};
