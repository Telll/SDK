console.log('Loadind websockets support ...');
// Load Websockets commands
CommandWS = require("./CommandWS.js");
/**
* Implements the telll controler
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Telll(){
    this.VERSION = "0.15";
    //Constructor
    console.log('Begin Telll controller '+this.VERSION+' ...');

    this.conf = require('./conf.js');
    this.device = this.getDevice();
    // get credentials and device id
    console.log('Device');
    console.log(this.device);
    this.credentials = {
        username: this.getCookie('username'),
        password: this.getCookie('password'),
        device: this.device.id,
        apiKey: '1234',
        authKey: this.getCookie('auth_key')
    };
    console.log('Credentials');
    console.log(this.credentials);
    this.movie = this.getCookie('movieId');

    // store var for views
    this.store = require('./store.js');
    // views
    this.loginView = {status:null};
    this.dashboardView = {status:null};
    this.clickboxView = {status:null};
    this.moviesListView = {status:null};
    this.photolinksListView = {status:null};
    this.telllBtnView = {status:null};
    this.tagPlayerView = {status:null};
    this.moviePlayerView = {status:null};

    // the web server API 
    this.tws = new telllSDK.TWS(this.conf.host); 
    this.cws = new CommandWS(this.conf.host);
    this.device.model = "iPad";
    
    // setting states
    if (this.credentials.authKey)
        this.tws.headers = {"X-API-Key": 123, "X-Auth-Key": this.credentials.authKey}; 
    this.cws.on("open", function() {
         console.log('CWS Opened!!!');
    });
}

/**
* @return {null}
*/
Telll.prototype.start = function(){
    console.log('Starting telll ...');
    this.getDevice(); 
    this.login(this.loadWidgets);

};

/**
* Telll.loadWidgets()
* @return bool
*/
Telll.prototype.loadWidgets = function(){
   // Load widgets
   this.showDashboard();
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
- donut if still authorized 
*/
Telll.prototype.login = function(data, cb){
    var loginView;
    // Creates the Login view object if dont have authKey
    if (!this.credentials.authKey) {
	    loginView = new telllSDK.View.Login( this );
            loginView.on('authOk', function(){if(cb) cb(null, data);});
            this.loginView = loginView;
    } else {if(cb) cb(null, data);}

    return true;
};

/**
* Telll.showClickbox()
* @param data {} 
* @return bool
*/
Telll.prototype.showClickbox = function(data){
    if (this.clickboxView.status) {
        console.log(this.clickboxView.status);
        switch (this.clickboxView.status){
        case 'closed':
        this.clickboxView.open();
        break;
        case 'open':
        this.clickboxView.close();
        break;
        case 'detached':
        this.clickboxView.attach();
        break;
        }
     } else this.clickboxView = new telllSDK.View.Clickbox ( this );
    return true;

};

/**
* Telll.showDashboard()
* @param data {} 
* @return bool
*/
Telll.prototype.showDashboard = function(data){
    if (this.dashboardView.status) {
        console.log(this.dashboardView.status);
        switch (this.dashboardView.status){
        case 'closed':
        this.dashboardView.open();
        break;
        case 'open':
        this.dashboardView.close();
        break;
        case 'detached':
        this.dashboardView.attach();
        break;
        }
     } else this.dashboardView = new telllSDK.View.Dashboard ( this );
    return true;
};


/**
* Telll.wsAuth()
* @param data {} 
* @return bool
*/
Telll.prototype.wsAuth = function(data, cb) {
	console.log("Contacting CWS");
	console.log(data);
    var me = this;
    var ret = this.cws.cmd.login({
        api_key:    this.credentials.apiKey,
        user_name:  data.user_name ? data.user_name : data.username,
        password:   data.password,
        model:      this.device.model
    }, function(response) {
        //response = response.msg;
        //console.log('Response:');
        //console.log(response);
        //console.log('Callback:');
        //console.log(cb);
        if("auth_key" in response.data) {
            me.credentials.authKey = response.data.auth_key;
            me.credentials.username = data.username;
            me.credentials.password = data.password;
	    me.tws.headers = {"X-API-Key": 123, "X-Auth-Key": response.data.auth_key}; 
            if(cb) cb(null, response.data);
        } else cb(response.error, response.data);
    });
    //console.log(ret);
    return ret;
};

/**
* Telll.logout()
* @param data {} 
* @return bool
*/
Telll.prototype.logout = function(cb) {
    var ret = cws.cmd.logout({
        api_key:    this.credentials.apiKey,
        auth_key:   this.credentials.authKey,
    }, function(response) {
        if(cb) cb(response.error, response.data);
    });
};

/**
* Telll.syncPlayer()
* @param tagPlayer {} 
* @param moviePlayer {} 
* @return bool
*/
Telll.prototype.syncPlayer = function(t, m, cb) {
    console.log(t);
    console.log(m);
    m.on('changeTime', function(time){
        t.time = time;
        t.emit( 'changeTime', t.time );
        //console.log(m.time);
    });
    t.on('changeTime', function(time){
         //console.log(t.time);
    });
    if(cb) cb(t.time);
};



/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.auth = function(data, cb){
    console.log('Contacting TWS');
    console.log(data);
    this.user = new telllSDK.TWS.User(data);
    var xhr = this.tws.login(this.user, this.device.model);
    xhr.addEventListener('load', function(){
        console.log(this.responseText);
        var jsData = JSON.parse(this.responseText);
        console.log(jsData);
        $.extend(jsData,data,jsData);
        if (jsData.error) alert(jsData.error);
	else if(cb) cb.call(this, jsData);
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
    else this.photolinksListView = new telllSDK.View.PhotolinksList( this );
    $("#panel-sensor").on( "some-event", function( e, data ) {
	// Do some
    });
    return true;
};

/**
* @return {null}
*/
Telll.prototype.showMockPlayer = function(){
    //TODO: Implement Me 
    console.log('Showing the Mock player');
    this.moviePlayerView = new telllSDK.View.MockPlayer ( this );

};

/**
* @return {null}
*/
Telll.prototype.showMoviePlayer = function(){
    //TODO: Implement Me 
    console.log('Showing the Telll player');
    this.moviePlayerView = new telllSDK.View.TelllPlayer ( this );

};

/**
* @return {null}
*/
Telll.prototype.showYoutubePlayer = function(){
    //TODO: Implement Me 
    console.log('Showing the Youtube player');
    this.moviePlayerView = new telllSDK.View.YoutubePlayer ( this );

};


/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.showTagPlayer = function(trkm){
    //TODO: Implement Me 
    console.log('Showing the tag player');
    this.tagPlayerView = new telllSDK.View.TagPlayer ( this );

};

/**
* @return {null}
*/
Telll.prototype.showMoviesList = function(){
    //TODO: Implement Me 
    console.log('Showing the Movies List');
    this.movie = this.getMovie(0);
    this.store.movies = this.listMovies();
    this.moviesListView = new telllSDK.View.MoviesList( this );
};


/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.showTelllBtn = function(trkm){
    //TODO: Implement Me 
    console.log('Showing the telll button');
    this.telllBtnView = new telllSDK.View.TelllBtn ( this );

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
* @param userId {} 
* @return bool
*/
Telll.prototype.getUser = function(userId, cb){
    if (this.credentials.authKey){ 
	    if (!userId){
		    var xhr = this.tws.self();
                    xhr.addEventListener('load', function(){
                        var jsData = JSON.parse(this.responseText);
                        if (jsData.error) alert(jsData.error);
                        else {
			    if(cb) cb.call(this, jsData);
	                    //this.user = new telllSDK.TWS.User(
			    //    this.credentials.authKey, 
			    //    jsData.userId
			    //);

			} 
                    });	
	    } else
	    this.user = new telllSDK.TWS.User(this.credentials.authKey, userId);
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
    this.listPhotolinksView = new telllSDK.View.ListPhotolinks ( this );

};


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.listMovies = function(data){
    //TODO: Implement Me 
    this.listMoviesView = new telllSDK.View.MoviesList ( this );

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
* Retrieve the device.
* If  
* @return {null}
*/
Telll.prototype.getDevice = function () {
    var device = this.device || {id:null};
    if (device.id){return device;}
    device.id = this.getCookie('device');
    // TODO: connect with TWS to retrieve device data
    //device.model = navigator.userAgent; TODO: retrieve model from environment
    device.model = 'iPad'; // default model
    // TODO: it bellow is better to be in some view ... we want node.js compatibility
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
    return device;
};



module.exports = {Telll:Telll};
