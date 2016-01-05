require ('./iPlayer.js');
/**
* Generated On: 2015-10-8
* Class: YoutubePlayer
* @constructor
*/

function YoutubePlayer(t){
    //Constructor
    this.t = t;
    this._init(t);
}

YoutubePlayer.prototype =Object.create(iPlayer.prototype);

/**
* @param t {} 
* @return bool
*/
YoutubePlayer.prototype._init = function(t){
    this.state = null;
    this._showWidget(t.store);
    return null;
}

/**
* @param data {} 
* @return bool
*/
YoutubePlayer.prototype._showWidget = function(data){
    console.log('Showing the youtube_player widget');
    var tmpl = require('./templates/youtube_player.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="youtube_player-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    this.state = "open";
    var telll = this.t;
    var me = this;
    $( "#close-button" ).on("click", function(e) {
        e.preventDefault();
	// do stuff
	me.state = "sent";
	me.detach();
    });

    return true;
};

module.exports = {YoutubePlayer:YoutubePlayer};
