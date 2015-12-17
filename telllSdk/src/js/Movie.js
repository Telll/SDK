require('./iData.js');
/**
* Class: Movie
* @constructor
*/
function Movie(t){
    //Constructor
    console.log('Telll Movie ...');
    this._init (t);
}
Movie.prototype =Object.create(iData.prototype);
/**
* @param t {} 
* @return bool
*/
Movie.prototype._init = function(t){
    this.t = t;
    this.title = "none";
};

/** 
 * getTitle
  * */
Movie.prototype.getTitle = function ()
{
   return this.title;
};


/** 
 * Create
 * @param data {}
 * @param cb function(){}
  * */
Movie.prototype.create = function (data, cb)
{
   this.save(data, cb);
};

/** 
 * Update
 * @param data {}
 * @param cb function(){}
  * */
Movie.prototype.update = function (data, cb)
{
   this.save(data, cb);
};

/** 
 * Read
 * @param id integer
 * */
Movie.prototype.read = function (id, cb)
{
    var me = this;
    if (this.t.credentials.authKey){
	var xhr = this.t.tws.getMovie(id);
        xhr.addEventListener('load', function(){
            var jsData = JSON.parse(this.responseText);
            if (jsData.errors) alert("Error: "+JSON.stringify(jsData.errors[0].message));
            else {
                me.merge(jsData);
	        if(cb) cb(jsData);
	    } 
        });	
    }
};

/** 
 * Save
 * @param data {}
 * @param cb function(){}
 * */
Movie.prototype.save = function (data, cb)
{
    var me = this;
    if (this.t.credentials.authKey){
	var xhr = this.t.tws.saveMovie(data);
        xhr.addEventListener('load', function(){
            var jsData = JSON.parse(this.responseText);
            if (jsData.errors) alert("Error: "+JSON.stringify(jsData.errors[0].message));
            else {
                me.merge(data);
	        if(cb) cb(jsData);
	    } 
        });	
    }
};

/** 
 * Delete
 * @param data {}
 * @param cb function(){}
 * */
Movie.prototype.delete = function (data, cb)
{
    var me = this;
    if (this.t.credentials.authKey){
	var xhr = this.t.tws.deleteMovie(data);
        xhr.addEventListener('load', function(){
            console.log('loaded ...');
            console.log(this.responseText);
            var jsData = JSON.parse(this.responseText);
            if (jsData.errors) alert(jsData.errors);
            else {
	        if(cb) cb(jsData);
                me = {};
	    } 
        });	
    }
};


/** 
 * merge one or more objects to this
 * @param list of objects
Movie.prototype.merge = function (data)
{
    console.log(data);
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
 * */



module.exports = {Movie:Movie};
