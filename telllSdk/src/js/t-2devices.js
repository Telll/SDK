var CommandWS = require('./CommandWS.js');
var conf = require("./conf.js");
var dsk = new CommandWS(conf.host);
var mob = new CommandWS(conf.host);

mob.custom = {};
dsk.custom = {};
mob.stash = {};
dsk.stash = {};

dsk.custom.setApiKey = function(api_key) {dsk.stash.api_key = api_key};
mob.custom.setApiKey = function(api_key) {mob.stash.api_key = api_key};

dsk.custom.login = function(user_name, password, cb) {
    var ret = dsk.cmd.login({
        api_key:    dsk.stash.api_key,
        user_name:  user_name,
        password:   password,
        model:      "iPad"
    }, function(response) {
        if("auth_key" in response.data) {
            dsk.stash.auth_key = response.data.auth_key;
            if(cb) cb(null, response.data);
        } else cb(response.error);
    });
}
mob.custom.login = function(user_name, password, cb) {
    var ret = mob.cmd.login({
        api_key:    mob.stash.api_key,
        user_name:  user_name,
        password:   password,
        model:      "iPad"
    }, function(response) {
        if("auth_key" in response.data) {
            mob.stash.auth_key = response.data.auth_key;
            if(cb) cb(null, response.data);
        } else cb(response.error);
    });
}

mob.custom.subscribePhotolink = function(cb) {
    var ret = mob.cmd.photolink({
        api_key:    mob.stash.api_key,
        auth_key:   mob.stash.auth_key,
    }, function(response) {
        if(cb) cb(response.error, response.data);
    });
}
dsk.custom.clickTrackmotion = function(trackmotion, cb) {
        var xhr = new XMLHttpRequest();
        var headers = {
            "X-API-Key": dsk.stash.apy_key,  
            "X-Auth-Key": dsk.stash.auth_key
        };
        var str = "BLA BLA";
        xhr.open('POST', 'http://'+conf.host+'/app/track_motion/'+trackmotion+'/click', true);
        for(var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
        }
        xhr.addEventListener("load", function(response){
            console.log('Loaded!');
            console.log(this.responseText);
            cb();
        });
        xhr.send(str);
        console.log(xhr);
        return xhr;
}
dsk.custom.clickTrackmotionWS = function(trackmotion, cb) {
    var ret = dsk.cmd.click_trackmotion({
        api_key:    dsk.stash.api_key,
        auth_key:   dsk.stash.auth_key,
        trackmotion:    trackmotion
    }, function(response) {
        if(cb) cb(response.error, response.data);
    });
}
dsk.on("open", function() {
    dsk.custom.setApiKey("1234");
    dsk.custom.login("smokemachine", "12345", function(error, cmd) {
        // you are logged in!
        // or there's a error
        if(error) throw error;
        console.log("dsk logged in!");
	console.log(dsk.stash);
        setTimeout(function() {
            dsk.custom.clickTrackmotion(1, function(){console.log('Clicked TWS!')});
        }, 1000);
        setTimeout(function() {
            dsk.custom.clickTrackmotionWS(1, function(){console.log('Clicked WS!')});
        }, 2000);
    });
});
mob.on("open", function() {
    mob.custom.setApiKey("1234");
    mob.custom.login("smokemachine", "12345", function(error, cmd) {
        // you are logged in!
        // or there's a error
        if(error) throw error;
        console.log("mob logged in!");
	console.log(mob.stash);
        mob.custom.subscribePhotolink(function(error, photolink) {
            alert(JSON.stringify(photolink));
        });
    });
});
