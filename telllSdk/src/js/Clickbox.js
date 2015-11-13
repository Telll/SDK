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
    $(".telll-clickbox-widget .close").on( "click", function( e, data ) {
	me.detach();
        console.log('Clickbox closing ...');
    });

    // The popup 
    $('<div class="popup-overlay"></div>').appendTo('body');
    $('<div id="popup-clickbox" class="popup"></div>').appendTo('body');
    $("#clickbox-widget").appendTo('#popup-clickbox').fadeIn();
    $('#popup-clickbox').css('z-index','999');
    $('html').addClass('overlay');


    return true;
};

/**
* @return null
*/
Clickbox.prototype.detach = function(){
    $('.telll-clickbox-widget').detach();
    $('.popup').detach();
    $('div.popup-overlay').detach();
    this.status = "detached";
};

/**
* @return null
*/
Clickbox.prototype.attach = function(){
    this._showWidget(this.t.store);
};


module.exports = {Clickbox:Clickbox};
