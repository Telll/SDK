/**
* Implements the telll controler
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Telll(){
    //Constructor
    console.log('Begin Telll controller ...');

   // get credentials and device id
    this.credentials = {
        username: this.getCookie('username'),
        password: this.getCookie('password'),
        device: this.getDevice().id,
        authKey: this.getCookie('auth_key')
    };
    console.log('Credentials');
    console.log(this.credentials);
    this.movie = this.getCookie('movieId');
    this.conf = require('./conf.js');
    // store var for views
    this.store = require('./store.js');
    // the web server API 
    this.tws = new telllSDK.TWS(this.conf.host); 
    this.cws = new CommandWS(this.conf.host); 
    this.deviceModel = "iPad";
}

/**
* @return {null}
*/
Telll.prototype.start = function(){
    console.log('Starting telll ...');
    this.getDevice(); 
    this.login();

// TODO: separate from view, we dont want a $(some) here
    var me = this;
    $("#login-ok").on( "authOk", function( e, data ) {
        me.loadWidgets();
    });
};

/**
* Telll.loadWidgets()
* @return bool
*/
Telll.prototype.loadWidgets = function(){
   // Load widgets
   this.showClickbox();
   this.showPhotolinksList();
   this.showTagPlayer();
   this.showTelllBtn();
};

/**
* Telll.login()
* @param data {} 
* @return bool
Construct the login machine.
- login widget
- 
*/
Telll.prototype.login = function(data){
    var loginView;
    // Creates the Login view object if dont have authKey
    if (!this.credentials.authKey) loginView = new telllSDK.View.Login( this );
    else this.loadWidgets();
    return true;
};

/**
* Telll.showClickbox()
* @param data {} 
* @return bool
*/
Telll.prototype.showClickbox = function(data){
    this.store.photolink = this.photolink;
    var clickboxView = new telllSDK.View.Clickbox( this );
    return true;
};

Telll.prototype.wsAuth = function(data) {
    var ret = this.cws.cmd.login({
        api_key:    this.api_key,
        user_name:  data.user_name ? data.user_name : data.username,
        password:   data.password,
        model:      "iPad"
    }, function(response) {
        if("auth_key" in response.data) {
            this.credentials.authKey = response.data.auth_key;
        }
        if(data.cb) data.cb.call(this, response.error, response.data);
    }.bind(this));
    return ret;
}

/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.auth = function(data){
    console.log('Contacting TWS');
    console.log(data);
    this.user = new telllSDK.TWS.User(data);
    var xhr = this.tws.login(this.user, this.deviceModel);
    xhr.addEventListener('load', function(){
        console.log(this.responseText);
        var jsData = JSON.parse(this.responseText);
        console.log(jsData);
// TODO: separate from view, we dont want a $(some) here
        $.extend(jsData,data,jsData);
        if (jsData.error) alert(jsData.error);
	else $( "#login-ok" ).trigger( "authOk",jsData );
    });	 
    return xhr;
};

/**
* @return {null}
*/
Telll.prototype.showPhotolinksList = function(){
    console.log('Showing the telll panel');
    // get movie and list of photolinks
    var movie; 
    if (!this.movie) {
        alert('Please, select a movie first.');
        this.showMoviesList();
    }
    else var panelView = new telllSDK.View.PhotolinksList( this );
    $("#panel-sensor").on( "some-event", function( e, data ) {
	// Do some
    });
    return true;
};

/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.showTagPlayer = function(trkm){
    //TODO: Implement Me 
    console.log('Showing the tag player');

};

/**
* @return {null}
*/
Telll.prototype.showMoviesList = function(){
    //TODO: Implement Me 
    console.log('Showing the Movies List');
    this.movie = this.getMovie(0);
    this.store.movies = this.listMovies();
    var moviesView = new telllSDK.View.MoviesList( this );
};


/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.showTelllBtn = function(trkm){
    //TODO: Implement Me 
    console.log('Showing the telll button');

};

/**
* @param movieId {} 
* @return bool
*/
Telll.prototype.getMovie = function(movieId){
    if (this.credentials.authKey){ 
        this.movie = new telllSDK.TWS.Movie(this.credentials.authKey, movieId);
    }
};


/**
* @param plId {} 
* @return {null}
*/
Telll.prototype.getPhotolink = function(plId){
    //TODO: Implement Me 

};


/**
* @param trkId {} 
* @return {null}
*/
Telll.prototype.getTrackms = function(trkId){
    //TODO: Implement Me 

};


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.listPhotolinks = function(data){
    //TODO: Implement Me 

};


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.listMovies = function(data){
    //TODO: Implement Me 

};


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.sendPhotolink = function(data){
    //TODO: Implement Me 

};



/**
* @param cname 
* @param cvalue 
* @param extime
* @return string
*/
Telll.prototype.setCookie = function (cname, cvalue, extime) {
    var d = new Date();
    d.setTime(d.getTime() + extime);
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};

/**
* @param cname 
* @return {null}
*/
Telll.prototype.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
    }
    return "";
};

/**
* @param cname 
* @return {null}
*/
Telll.prototype.getDevice = function () {
    var device = this.device || {id:null};
    //this.deviceModel = navigator.userAgent;
    this.deviceModel = 'iPad';
    console.log(this.deviceModel);
    device.isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
    // TODO: connect with TWS to retrieve device data
    device.id = this.getCookie('device');
    return device;
};



module.exports = {Telll:Telll};
