// telll SDK
// by Monsenhor filipo@kobkob.org
// license GPL Affero 3.0
CommandWS = require("./CommandWS.js");
// creates the object telllSDK
var telllSDK = {};
telllSDK = require('./Telll.js');
telllSDK.TWS = {};
telllSDK.View = {};
telllSDK.TWS.Movie = require('./Movie.js').Movie;
telllSDK.TWS.User = require('./User.js').User;
telllSDK.TWS.Trackms = require('./Trackms.js').Trackms;
telllSDK.TWS.Photolink = require('./Photolink.js').Photolink;
telllSDK.View.TagPlayer = require('./TagPlayer.js').TagPlayer;
telllSDK.View.PhotolinkList = require('./PhotolinksList.js').PhotolinksList;
telllSDK.View.Clickbox = require('./Clickbox.js').Clickbox;
telllSDK.View.TelllBtn = require('./TelllBtn.js').TelllBtn;
telllSDK.View.TelllPlayer = require('./TelllPlayer.js').TelllPlayer;
//telllSDK.View.YoutubePlayer = require('./TelllYoutubePlayer.js').YoutubePlayer;
console.log(telllSDK);
console.log(CommandWS);
