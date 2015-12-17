var CommandWS = require('./CommandWS.js');
var conf = require("./conf.js");
var cws = new CommandWS(conf.host);

cws.custom = {};
cws.stash = {};
cws.custom.setApiKey = function(api_key) {cws.stash.api_key = api_key};
cws.custom.login = function(user_name, password, cb) {
    var ret = cws.cmd.login({
        api_key:    cws.stash.api_key,
        user_name:  user_name,
        password:   password,
        model:      "iPad"
    }, function(response) {
        if("auth_key" in response.data) {
            cws.stash.auth_key = response.data.auth_key;
            if(cb) cb(null, response.data);
        } else cb(response.error);
    });
}
cws.custom.logout = function(cb) {
    var ret = cws.cmd.logout({
        api_key:    cws.stash.api_key,
        auth_key:   cws.stash.auth_key,
    }, function(response) {
        if(cb) cb(response.error, response.data);
    });
}
cws.custom.subscribePhotolink = function(cb) {
    var ret = cws.cmd.photolink({
        api_key:    cws.stash.api_key,
        auth_key:   cws.stash.auth_key,
    }, function(response) {
        if(cb) cb(response.error, response.data);
    });
}
cws.custom.clickTrackmotion = function(trackmotion, cb) {
    var ret = cws.cmd.click_trackmotion({
        api_key:    cws.stash.api_key,
        auth_key:   cws.stash.auth_key,
        trackmotion:    trackmotion
    }, function(response) {
        if(cb) cb(response.error, response.data);
    });
}
cws.on("open", function() {
    cws.custom.setApiKey("1234");
    cws.custom.login("smokemachine", "12345", function(error, cmd) {
        // you are logged in!
        // or there's a error
        if(error) throw error;
        console.log("we are logged in!");
        cws.custom.subscribePhotolink(function(error, photolink) {
            alert(JSON.stringify(photolink));
        });
        setTimeout(function() {
            cws.custom.clickTrackmotion(1);
        }, 1000);
        setTimeout(function() {
            cws.custom.logout();
        }, 3000);
    });
});
