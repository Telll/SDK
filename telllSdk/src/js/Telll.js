/**
* Implements the telll controler
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Telll(){
    //Constructor
    console.log('Telll SDK - Telll, the controller ...');
    // get telll cookies and device id
    this.credentials = {
        username: this.getCookie('username'),
        password: this.getCookie('password'),
        device: this.getDevice().id,
        auth: this.getCookie('auth')
    };
    this.tws = {
        user: new telllSDK.TWS.User(),
        device: new telllSDK.TWS.Device(),
        movie: new telllSDK.TWS.Movie(),
        trackms: new telllSDK.TWS.Trackms(),
        photolink: new telllSDK.TWS.Photolink()
    };
}

/**
* @return {null}
*/
Telll.prototype.start = function(){
    console.log('Starting telll ...'); 
    this.login();
    // Load widgets
    this.showPanel();
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
    if (!this.credentials.auth) new telllSDK.View.Login( this );
    return true;
};

/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.auth = function(data){
    console.log('Contacting TWS');
    console.log(CommandWS);
};

/**
* @param trkm {} 
* @return {null}
*/
Telll.prototype.showPanel = function(trkm){
    console.log('Showing the telll panel');

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
    if (this.credentials.auth){ 
        this.movie = new telllSDK.TWS.Movie(this.credentials.auth, movieId);
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
* @param exdays
* @return string
*/
Telll.prototype.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

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
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

/**
* @param cname 
* @return {null}
*/
Telll.prototype.getDevice = function () {
    var device = this.device || {id:null};
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
    return device;
}



module.exports = {Telll:Telll};
