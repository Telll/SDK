/**
* Implements the telll controler
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Telll(){
    this.VERSION = "0.16.0";
    //Constructor
    //console.log('Begin Telll controller '+this.VERSION+' ...');

    this.conf = require('./conf.js');
    this.device = this.getDevice();
    // get credentials and device id
    //console.log('Device');
    //console.log(this.device);
    this.credentials = {
        //username: this.getCookie('username'),
        //password: this.getCookie('password'),
        device: this.device.id,
        apiKey: '1234',
        authKey: this.getCookie('auth_key')
    };
    //console.log('Credentials');
    //console.log(this.credentials);
    //this.movie = this.getMovie(this.getCookie('movieId'));

    // store var for views
    this.store = require('./store.js');
    // views
    this.loginView = {state:null};
    this.dashboardView = {state:null};
    this.clickboxView = {state:null};
    this.moviesListView = {state:null};
    this.photolinksListView = {state:null};
    this.telllBtnView = {state:null};
    this.tagPlayerView = {state:null};
    this.moviePlayerView = {state:null};

    // the web server API 
    this.tws = new telllSDK.TWS(this.conf.host); 
    this.cws = new telllSDK.CWS(this.conf.host);
    this.device.model = "iPad"; //TODO use other models ... :)
    
    // setting states
    if (this.credentials.authKey)
        this.tws.headers = {"X-API-Key": 123, "X-Auth-Key": this.credentials.authKey}; 
    this.cws.on("open", function() {
         //console.log('CWS Opened!!!');
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
    if (this.clickboxView.state) {
        //console.log(this.clickboxView.state);
        switch (this.clickboxView.state){
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
    if (this.dashboardView.state) {
        //console.log(this.dashboardView.state);
        switch (this.dashboardView.state){
        case 'closed':
        this.dashboardView.open();
        break;
        case 'open':
        console.log('hmmmm ... its suposed to be closed!');
        this.dashboardView.detach();
        this.dashboardView = new telllSDK.View.Dashboard ( this );
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
	//console.log("Contacting CWS");
	//console.log(data);
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
    var ret = this.cws.cmd.logout({
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
    console.log("Syncing Player ..");
    console.log(t);
    console.log(m);
    m.on('timeupdate', function(time){
        t.time = time;
        t.emit( 'changeTime', t.time );
        //console.log(m.time);
    });
    t.on('timeupdate', function(time){
         //console.log(t.time);
    });
    if(cb) cb(t.time);
    console.log("Syncing Player end!!!..");
};



/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.auth = function(data, cb){
    //console.log('Contacting TWS');
    //console.log(data);
    this.user = new telllSDK.TWS.User(data);
    var xhr = this.tws.login(this.user, this.device.model);
    xhr.addEventListener('load', function(){
        //console.log(this.responseText);
        var jsData = JSON.parse(this.responseText);
        console.log(jsData);
        $.extend(jsData,data,jsData);
        if (jsData.error) alert(jsData.error);
	else if(cb) cb.call(this, jsData);
    });	 
    return xhr;
};

/**
* @return {iView} the PhotolinksList View
*/
Telll.prototype.showPhotolinksList = function(){
    console.log('Showing the telll panel');
    // get movie and list of photolinks
    var me = this;
    if (!this.movie) {
        alert('Please, select a movie first.');
        this.showMoviesList(function(m){
            //register movie
            //me.movie = m;
            //get photolinks list
            me.photolinksListView = new telllSDK.View.PhotolinksList( me );
        });
    }
    else this.photolinksListView = new telllSDK.View.PhotolinksList( this );
    return this.photolinksListView;
};

/**
* @return {null}
* @listens MockPlayer
*/
Telll.prototype.showMockPlayer = function(cb){
    if (!this.moviePlayerView.state) {
    console.log("Creating a new MockPlayer");
    this.moviePlayerView = new telllSDK.View.MockPlayer ( this );
    this.moviePlayerView.once("loaded", function(movie){
        console.log("MockPlayer loaded with ", movie);
        if (cb) cb(this);
    });
    } else {
      console.log("Using the same view ...");
      this.moviePlayerView.atach();
      if (cb) cb(this.moviePlayerView);
    }
};

/**
* @return {null}
*/
Telll.prototype.showMoviePlayer = function(){
    this.moviePlayerView = new telllSDK.View.TelllPlayer ( this );

};

/**
* @return {null}
*/
Telll.prototype.showYoutubePlayer = function(){
    this.moviePlayerView = new telllSDK.View.YoutubePlayer ( this );

};


/**
* @param player {iPlayer} The movie Player must be a iPlayer 
* @return {null}
*/
Telll.prototype.showTagPlayer = function(player, cb){
    var me = this;
    var t = this.t;
    console.log("Showing TagPlayer ...");
    //console.log(this.tagPlayerView);
    //console.log(player, cb);
    //console.log(this.movie);
    // prepare the store
    //console.log("The telll store:");
    //console.log(this.store);
    //if (!this.tagPlayerView.state) {
          console.log("Creating a new tag player");
          this.tagPlayerView = new telllSDK.View.TagPlayer ( me, player );
          console.log("Created a new tag player");
          console.log(this.tagPlayerView);
          if (cb) cb( me.tagPlayerView );
/*    } else {
          this.getPhotolinksOfMovie(t.movie.id, function(pl){
             console.log("Reutilizing the tag player");
             this.tagPlayerView.list = pl;
             this.tagPlayerView.loadTags(t.movie.id);
             if (cb) cb( me.tagPlayerView );
          });
    }*/
};

/**
* MoviesList is a modal widget showing a mosaic of movie thumbnails
* with title and description. 
* When a movie is selected it is assigned to telll.movie and is sent to the callback
* 
* @return {null}
*/
Telll.prototype.showMoviesList = function(cb){
    console.log('Showing the Movies List');
    var me = this;
    this.listMovies(null, function(ml){
        console.log('Running the Movies List setup');
        me.store.movies = ml;
        me.moviesListView = new telllSDK.View.MoviesList( me );
        me.moviesListView.once('selected', function(m){
            console.log("Movie selected: ", m);
            me.getMovie(m.id, function (movie){
               console.log("Telll.showMoviesList callback from getMovie:" , movie);
               // assign movie to me!!!
               me.movie = movie;
               if(cb) cb(movie);
            });
        });
    });
};

/**
* @param data {} 
* @return {null}
*/
Telll.prototype.listMovies = function(data, cb){
    var me = this;
    if (this.credentials.authKey){ 
	var xhr = this.tws.moviesList();
        xhr.addEventListener('load', function(){
            var jsData = JSON.parse(this.responseText);
            if (jsData.error) alert(jsData.error);
            else {
		me.moviesList = jsData.movies;
	        if(cb) cb(jsData.movies);
	    } 
        });	
    }
    //if (cb) cb(this.moviesList);
    return null;
};



/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.showTelllBtn = function(trkm){
    //TODO: Implement Me 
    //console.log('Showing the telll button');
    this.telllBtnView = new telllSDK.View.TelllBtn ( this );

};

/**
* Load movieId in this.movie 
* forward the callback to Movie.read()
* @param movieId {}
* @param cb callback
* @return bool
*/
Telll.prototype.getMovie = function(movieId, cb){
    if (this.credentials.authKey){
        if (!this.movie)
        this.movie = new telllSDK.TWS.Movie(this);
	this.movie.read(movieId, cb);
    }
    return false;
};

/**
* @param movieId {}
* @param cb callback
* @return bool
*/
Telll.prototype.getPhotolinksOfMovie = function(movieId, cb){
    console.log("Telll.getPhotolinksOfMovie: Reading photolinks of movie: "+movieId);
    if (this.credentials.authKey){ 
        if (!this.movie)
        this.movie = new telllSDK.TWS.Movie(this);
	this.movie.readPhotolinks(movieId, cb);
    }
    console.log("Telll.getPhotolinksOfMovie: Reading photolinks of movie: done!!!");
    return this.movie;
};



/**
 * Save movie data from form
* @param data {} SerializedArray from dashboard movie form
* @param cb callback function
* @return bool
*/
Telll.prototype.saveMovie = function(data, cb){
    var result = {};
    data.forEach(function(e){
        result[e.name]=e.value;
    });
    if (!this.movie)
    this.movie = new telllSDK.TWS.Movie(this);
    this.movie.save(result, cb);
};

/**
 * Delete movie
* @param data {} SerializedArray from dashboard movie form
* @param cb callback function
* @return bool
*/
Telll.prototype.deleteMovie = function(data, cb){
    var result = {};
    data.forEach(function(e){
        result[e.name]=e.value;
    });
    if (!this.movie)
    this.movie = new telllSDK.TWS.Movie(this);
    this.movie.delete(result, cb);
};


/**
* @param userId {} 
* @return bool
*/
Telll.prototype.getUser = function(userId, cb){
    var me = this;
    this.user = new telllSDK.TWS.User(this);
    if (this.credentials.authKey){ 
        if (!userId){
	    this.user.self(cb);
            console.log(this.user);
        } else this.user.read(userId);
    } 
    return this.user;
};

/**
 * Save user data from form
* @param data {} SerializedArray from dashboard movie form
* @param cb callback function
* @return bool
*/
Telll.prototype.saveUser = function(data, cb){
    var result = {};
    data.forEach(function(e){
        result[e.name]=e.value;
    });
    this.user = new telllSDK.TWS.User(this);
    this.user.save(result, cb);
};

/**
 * Delete user
* @param data {} SerializedArray from dashboard movie form
* @param cb callback function
* @return bool
*/
Telll.prototype.deleteUser = function(data, cb){
    var result = {};
    data.forEach(function(e){
        result[e.name]=e.value;
    });
    this.user = new telllSDK.TWS.User(this);
    this.user.delete(result, cb);
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
* @param id {Integer} 
* @param cb {} Callback 
* @return {null}
*/
Telll.prototype.getTracks = function(id, cb){
    console.log("Getting tracks with cws ...");
    console.log("For movie: ", id);
    var ret = this.cws.cmd.trackmotions_from_movie({
        api_key:    this.credentials.apiKey,
        auth_key:   this.credentials.authKey,
	movie: parseInt(id)
    }, function(response) {
        if(cb) cb(response.error, response.data);
    });
    console.log(ret);
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
