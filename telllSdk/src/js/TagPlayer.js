require ('./iView.js');
/**
* Generated On: 2015-10-8
* Class: TagPlayer
*/
function TagPlayer(t){
    //Constructor
    this.t = t;
    this._init(t);
}

TagPlayer.prototype =Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
*/
TagPlayer.prototype._init = function(t){
    this.status = null;
    this._showWidget(t.store);
    return null;
}

/**
* @param data {} 
* @return bool
*/
TagPlayer.prototype._showWidget = function(data){
    console.log('Showing the tag_player widget');
    var tmpl = require('./templates/tag_player.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="tag_player-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    this.status = "open";
    var telll = this.t;
    var me = this;
    $( "#close-button" ).on("click", function(e) {
        e.preventDefault();
	// do stuff
	me.status = "sent";
	me.detach();
    });

    return true;
};





module.exports = {TagPlayer:TagPlayer};
