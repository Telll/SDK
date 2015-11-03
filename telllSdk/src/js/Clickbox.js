require ('./iView.js');
/**
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Clickbox(t){
    this.t = t;
    this._init(t);
}

Clickbox.prototype = Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
*/
Clickbox.prototype._init = function(t){
    this.status = null;
    this._showWidget(t.store);
    return null;
}


/**
* @param data {} 
* @return bool
*/
Clickbox.prototype._showWidget = function(data){
    console.log('Showing the clickbox');
    var tmpl = require('./templates/clickbox.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="clickbox-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    var telll = this.t;
    var me = this;
    this.status = "open";
    $(".telll-clickbox-widget #close-button").on( "click", function( e, data ) {
	me.detach();
        console.log('Clickbox closing ...');
    });
    return true;
};

/**
* @return null
*/
Clickbox.prototype.detach = function(){
    $('.telll-clickbox-widget').detach();
};

module.exports = {Clickbox:Clickbox};
