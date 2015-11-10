require('./iData.js');
/**
  * class Tws
  * 
  */
Tws = function (server)
{
  this._init (server);
}

Tws.prototype = new iData ();
/*
Tws.prototype = {
    user: new telllSDK.TWS.User(),
    device: new telllSDK.TWS.Device(),
    movie: new telllSDK.TWS.Movie(),
    trackms: new telllSDK.TWS.Trackms(),
    photolink: new telllSDK.TWS.Photolink()
};*/ 

/**
 * Init
 */
Tws.prototype._init = function (server)
{

this.m_server = server;
this.method;
this.url;
this.delimiter;
//this.headers = {"X-API-Key": 123, "X-Auth-Key": "395fb7b657db2fb5656f34de3840e73c90b79c31"}; 
this.headers;
this.xhr;

}
/**
 * setHeaders
 */
Tws.prototype.setHeaders = function (h)
{
this.headers = h;
}


/**
 * user 
 * 
 */
Tws.prototype.user = function (data)
{
    console.log('Creating new user on Tws');
    console.log(data);
    if (data.username && data.email && data.password){
        // call Tws to create a new user

        var send = JSON.stringify(data);
        console.log(send);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function(){
            console.log('Response');
            console.log(this.responseText);
        });
        xhr.open('POST', 'http://52.3.72.192:3000/app/user', true);
        for(var key in this.headers) {
                xhr.setRequestHeader(key, this.headers[key]);
        }
        xhr.send(send);
        return xhr;


    } else {
        console.log ("{error:'wrong user data'}");
        return "{error:'wrong user data'}";
    }
}

/**
 * self 
 * 
 */
Tws.prototype.self = function ()
{
    // call Tws
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(){
        //console.log('Response');
        //console.log(this.responseText);
    });
    xhr.open('GET', 'http://'+this.m_server+'/app/user/self', true);
    for(var key in this.headers) {
            xhr.setRequestHeader(key, this.headers[key]);
    }
    xhr.send();
    return xhr;
}




/**
 * login 
 * 
 */
Tws.prototype.login = function (data, model)
{
    var url = 'http://'+this.m_server+'/login';
    var ptype = "POST";
    this.headers = {"X-API-Key": 123}; 
    var msg = "Login on Tws ...";
    data.user_name = data.username;
    data.model = model;
    //console.log(msg);
    //console.log(data);
    if (data.username && data.password){
        // call Tws to login
        var strSend = JSON.stringify(data);
        //console.log(send);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function(){
            //console.log('Response');
            //console.log(this.responseText);
            loginData = JSON.parse(this.responseText);
            this.headers = {"X-API-Key": 123, "X-Auth-Key": loginData.auth_key}; 
        });
        xhr.open(ptype , url, true);
        for(var key in this.headers) {
                xhr.setRequestHeader(key, this.headers[key]);
        }
        xhr.send(strSend);
        return xhr;
    } else {
        console.log ("{error:'wrong user data'}");
        return "{error:'wrong user data'}";
    }
}

/**
 * 
 * 
 */
Tws.prototype.getPhotolink = function ()
{
	this.url = this.m_server+'/app/photolink/lp';
        var lp = new LongPolling("GET", this.m_server+"/app/photolink/lp", "\n//----------//", this.headers);
        //var lp = new LongPolling("GET", "http://52.3.72.192:3000/app/photolink/lp", "\n//----------//", {"X-Api-Key": 1234, "X-Auth-Key": "4574eb62ff5337ce17f3d657f3b74cbcf3f9cc42"});
        lp.create();
	return lp;
}

/**
 * 
 * 
 */
Tws.prototype.sendPhotolink = function (str)
{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.m_server+'/app/photolink/send/0/0', true);
        for(var key in this.headers) {
                xhr.setRequestHeader(key, this.headers[key]);
        }

        xhr.send(str);
}



module.exports = {TWS:Tws};
