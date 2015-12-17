require('./iData.js');
/**
* Generated On: 2015-10-8
* Class: User
* @constructor
*/

function User(t){
    //Constructor
    console.log('Telll User ...');
    this._init (t);
}
User.prototype =Object.create(iData.prototype);
/**
* @param t {} 
* @return bool
*/
User.prototype._init = function(t){
    this.t = t;
};

/** 
 * Create
 * @param data {}
 * @param cb function(){}
  * */
User.prototype.create = function (data, cb)
{
   this.save(data, cb);
};

/** 
 * Update
 * @param data {}
 * @param cb function(){}
  * */
User.prototype.update = function (data, cb)
{
   this.save(data, cb);
};

/** 
 * Read
 * @param id integer
 * */
User.prototype.read = function (id)
{
};

/** 
 * self
 * @param cb function(){}
 * */
User.prototype.self = function (cb)
{
    var me = this;
    var t = this.t;
    if (this.t.credentials.authKey){ 
            var xhr = t.tws.self();
            xhr.addEventListener('load', function(){
                var jsData = JSON.parse(this.responseText);
                if (jsData.error) alert(jsData.error);
                else {
                    me.merge(jsData);
                    if(cb) cb.call(this, jsData);
                } 
            });	
    }
};


/** 
 * Save
 * @param data {}
 * @param cb function(){}
 * */
User.prototype.save = function (data, cb)
{
    me = this;
    if (this.t.credentials.authKey){
	var xhr = this.t.tws.saveUser(data);
        xhr.addEventListener('load', function(){
            var jsData = JSON.parse(this.responseText);
            if (jsData.errors) { 
                if (jsData.errors[0].path == "\/password") alert ("Please, you need to enter your password to edit your profile.");
                else alert("Error: "+JSON.stringify(jsData.errors[0].message));
            }
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
User.prototype.delete = function (data, cb)
{
    me = this;
    if (this.t.credentials.authKey){
	var xhr = this.t.tws.deleteUser(data);
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





module.exports = {User:User};
