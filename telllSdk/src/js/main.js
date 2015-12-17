// telll SDK
// by Monsenhor filipo@kobkob.org
// license GPL Affero 3.0
// TODO: add native suport out of webview or browser

var VERSION = "0.15";
//console.log('telllSDK javascript by Monsenhor, Version: '+VERSION);
var devMode = true;

// telll requires websockets, jquery and mustache
//console.log('Loadind jquery ...');
// Load jQuery
$ = require('jquery');
//console.log('Loadind mustache ...');
// Load mustache
Mustache = require('mustache');

//console.log('Loadind websockets support ...');
// Load Websockets commands
//CommandWS = require("./CommandWS.js");

//console.log('Loadind Telll classes ...');
// create the object telllSDK
telllSDK = {};
telllSDK = require('./Telll.js');
telllSDK.TWS = {};
telllSDK.TWS = require('./Tws.js').TWS;
//telllSDK.CWS = CommandWS;
telllSDK.CWS = require("./CommandWS.js");
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
telllSDK.View.Dashboard = require('./Dashboard.js').Dashboard;
telllSDK.View.TelllPlayer = require('./TelllPlayer.js').TelllPlayer;
telllSDK.View.MockPlayer = require('./MockPlayer.js').MockPlayer;
telllSDK.View.TagEditor = require('./TagEditor.js').TagEditor;
telllSDK.View.YoutubePlayer = require('./YoutubePlayer.js').YoutubePlayer;

//console.log(telllSDK);
//console.log(CommandWS);

///////////////////////////
// Util widgets and plugins

// Telll Dialog
telllDialog = function(msg, delay){
    $("<div class='telll-dialog'>"+msg+"</div>").appendTo("body").fadeIn(function(){
        setTimeout(function(){
             $(".telll-dialog").fadeOut(function(){$(".telll-dialog").detach();})
        }, delay);
    });
};

// Telll Modal Popup
telllPopup = function(element, title){
	if (!title) title = "telll";
    $('<div class="popup-overlay"></div>').appendTo('body');
    $('<div class="telll-popup popup"><div class="popup-titlebar widget-titlebar"><span class="title">'+title+'</span><button class="close">Close</button></div></div>').append(element).appendTo('body').fadeIn();
    $('.telll-popup').css('z-index','999');
    $('html').addClass('overlay');
    $('div.popup-titlebar .close').on('click', function(){
        $('.popup-overlay').detach();
        $('.popup').detach();
    });
}

if (devMode) exampleImplementation();

/* Example */
function exampleImplementation (){
console.log('Loading example implementation ...');
// load default css
var tmpl = require('./templates/default.mtjs');
if (tmpl.css)
$('<style id="default-css">'+tmpl.css+'</style>').appendTo('head');
 
myAdTest = new telllSDK.Telll();
// We may do it for a simplest aproach
// myAdTest.start();
// or to have more control

// Detect if local machine is off line each 3600 seconds
setInterval( function(){
 $.ajax({
   type: "GET",
   cache: null,
   url: "http://"+myAdTest.conf.host+"/ws"
 }).fail( function() {
   alert('Connection seems down! Please check your Internet.');
 });
},3600000);

myAdTest.login(null, function(){
    // create buttons
    $('<input type="button" value="Dashboard">').appendTo('body').on('click', function(){myAdTest.showDashboard()});
    $('<input type="button" value="Clickbox">').appendTo('body').on('click', function(){myAdTest.showClickbox()});
    $('<input type="button" value="Movies List">').appendTo('body').on('click', function(){myAdTest.showMoviesList(function(m){
    console.log("Movie selected: "+m.getTitle());
    console.log(m);
})});
   $('<input type="button" value="Mock Player">').appendTo('body').on('click', function(){myAdTest.showMockPlayer()});
    $('<input type="button" value="Telll Movie Player">').appendTo('body').on('click', function(){myAdTest.showMoviePlayer()});
    $('<input type="button" value="Youtube Player">').appendTo('body').on('click', function(){myAdTest.showYoutubePlayer()});
    $('<input type="button" value="Tag Player">').appendTo('body').on('click', function(){myAdTest.showTagPlayer()});
    $('<input type="button" value="Photolinks List">').appendTo('body').on('click', function(){myAdTest.showPhotolinksList()});
    $('<input type="button" value="Telll Button">').appendTo('body').on('click', function(){myAdTest.showTelllBtn()});
 
});

}
