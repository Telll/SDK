// telll SDK
// by Monsenhor filipo@kobkob.org
// license GPL Affero 3.0

console.log('telllSDK javascript by Monsenhor');

console.log('Loadind websockets ...');
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
telllSDK.View = {};
telllSDK.TWS.User = require('./User.js').User;
telllSDK.TWS.Device = require('./Device.js').Device;
telllSDK.TWS.Movie = require('./Movie.js').Movie;
telllSDK.TWS.Trackms = require('./Trackms.js').Trackms;
telllSDK.TWS.Photolink = require('./Photolink.js').Photolink;
telllSDK.View.Login = require('./Login.js').Login;
telllSDK.View.TagPlayer = require('./TagPlayer.js').TagPlayer;
telllSDK.View.PhotolinkList = require('./PhotolinksList.js').PhotolinksList;
telllSDK.View.Clickbox = require('./Clickbox.js').Clickbox;
telllSDK.View.TelllBtn = require('./TelllBtn.js').TelllBtn;
telllSDK.View.TelllPlayer = require('./TelllPlayer.js').TelllPlayer;
telllSDK.View.YoutubePlayer = require('./YoutubePlayer.js').YoutubePlayer;

//console.log(telllSDK);
//console.log(CommandWS);

/* Example */

console.log('Example implementation ...');
myAdTest = new telllSDK.Telll();
myAdTest.start();

