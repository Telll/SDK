/**
  * Abstract class iData
  * @interface 
  */
iData = function (t)
{
  this._init (t);
};

/** 
 * Init
 * */
iData.prototype._init = function (t)
{
  
};

/** 
 * Create
 * */
iData.prototype.create = function (t)
{
  alert('Implement method create!!!');
};

/** 
 * Update
 * */
iData.prototype.update = function (t)
{
  alert('Implement method update!!!');
  
};

/** 
 * Read
 * @param id integer
 * */
iData.prototype.read = function (id)
{
  alert('Implement method read!!!');
};

/** 
 * Delete
 * */
iData.prototype.delete = function (t)
{
  alert('Implement method delete!!!');
};

/** 
 * merge one or more objects to this
 * @param list of objects
 * */
iData.prototype.merge = function ()
{
    var i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                this[key] = arguments[i][key];
            }
        }
    }
    return this;
};  



