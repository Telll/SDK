require ('./iView.js');
/**
* Class: TagPlayer
* 
* It inherits the iView abstract class
*
* @param t {Telll} The Telll object
* @param mp {iPlayer} The movie player as a iPlayer instance
* @listens iPlayer 
* @constructor
*/
function TagPlayer(t, mp){
	if (! mp || mp.error) {
		alert ('Error: TagPlayer not working. Talk with the system administrator, please. '+mp.error)} else {
    this.t = t;
    this.mp = mp;
    this.state = null;
    this._init(t);
	}
}

TagPlayer.prototype =Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
* @private
*/
TagPlayer.prototype._init = function(t){
    var me = this;
    this.state = "init";
    this.emit(this.state);
    this._showWidget(t.store);
    this.sync(this.mp);
    return null;
}

/**
 *
 * @param data {} 
 * @return bool
 */
TagPlayer.prototype._showWidget = function(data){
    var tmpl = require('./templates/tagplayer.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="tag_player-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    var telll = this.t;
    var me = this;
    this.state = "showing";
    this.emit(this.state,html );
    return true;
};

/**
* @param mp {iPlayer} The movie player to sync 
* @param cb {} The callback
* @return bool
*/
TagPlayer.prototype.sync = function(mp,cb){
        this.t.syncPlayer(this, mp, cb);
	var telll = this.t;
	var me = this;
	mp.on('loaded', function(m){
		console.log('Loaded', m);
		// get trackms for this movie
	//	telll.getTracks(m);
		telll.getTracks(m, function(e, d){
			console.log(e);
			console.log(d);
                     this.state = "loaded";
		});
	});
	mp.on('playing', function(t){
		console.log('Playing',t);
	});
	mp.on('timeupdate', function(t){
		console.log('timeupdate', t);
	});
	mp.on('paused', function(t){
		console.log('Paused', t);
	});
	mp.on('stoped', function(t){
		console.log('Stoped', t);
	});
        return null;
}


module.exports = {TagPlayer:TagPlayer};
