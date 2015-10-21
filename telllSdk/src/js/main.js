// telll SDK
// by Monsenhor filipo@kobkob.org
// license GPL Affero 3.0
// TODO: add native suport out of webview or browser

var VERSION = "0.15";
console.log('telllSDK javascript by Monsenhor, Version: '+VERSION);

// telll requires websockets, jquery and mustache
console.log('Loadind websockets support ...');
// Load Websockets commands
CommandWS = require("./CommandWS.js");
console.log('Loadind jquery ...');
// Load jQuery
$ = require('jquery');
console.log('Loadind mustache ...');
// Load mustache
Mustache = require('mustache');

console.log('Loadind Telll classes ...');
// create the object telllSDK
telllSDK = {};
telllSDK = require('./Telll.js');
telllSDK.TWS = {};
telllSDK.TWS = require('./Tws.js').TWS;
telllSDK.View = {};
telllSDK.TWS.User = require('./User.js').User;
telllSDK.TWS.Device = require('./Device.js').Device;
telllSDK.TWS.Movie = require('./Movie.js').Movie;
telllSDK.TWS.Trackms = require('./Trackms.js').Trackms;
telllSDK.TWS.Photolink = require('./Photolink.js').Photolink;
telllSDK.View.Login = require('./Login.js').Login;
telllSDK.View.TagPlayer = require('./TagPlayer.js').TagPlayer;
telllSDK.View.PhotolinksList = require('./PhotolinksList.js').PhotolinksList;
telllSDK.View.MoviesList = require('./MoviesList.js').MoviesList;
telllSDK.View.Clickbox = require('./Clickbox.js').Clickbox;
telllSDK.View.TelllBtn = require('./TelllBtn.js').TelllBtn;
telllSDK.View.TelllPlayer = require('./TelllPlayer.js').TelllPlayer;
telllSDK.View.YoutubePlayer = require('./YoutubePlayer.js').YoutubePlayer;

console.log(telllSDK);
//console.log(CommandWS);

/* Example */

console.log('Loading simplest example implementation ...');
myAdTest = new telllSDK.Telll();
myAdTest.start();

