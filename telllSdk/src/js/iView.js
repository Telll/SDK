const util = require('util');
const EventEmitter = require('events');
/**
  * class iView
  * @interface 
  */
iView = function (t)
{
  this._init (t);
  this.t = t;
};

/**
* @param data {} 
* @return bool
*/
iView.prototype._init = function (t)
{
    EventEmitter.call(this);
  //throw('Implement method _init');
};

util.inherits(iView, EventEmitter);

/**
* @param data {} 
* @return bool
*/
iView.prototype._showWidget = function(templateName){
  throw('Implement method _showWidget');
};

/**
* @return null
*/
iView.prototype.detach = function(){
  throw('Implement method detach');
};

/**
* @return null
*/

iView.prototype.attach = function(){
  throw('Implement method attach');
};
/**
* @return null
*/
iView.prototype.open = function(){
  throw('Implement method open');
};

/**
* @return null
*/
iView.prototype.close = function(){
  throw('Implement method close');
};

