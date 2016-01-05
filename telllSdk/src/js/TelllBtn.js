require ('./iView.js');
/**
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function TelllBtn(t){
    this.t = t;
    this._init(t);
}

TelllBtn.prototype =Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
*/
TelllBtn.prototype._init = function(t){
    this.state = null;
    this._showWidget(t.store);
    return null;
}

/**
* @param data {} 
* @return bool
*/
TelllBtn.prototype._showWidget = function(data){
    console.log('Showing the telll_btn widget');
    var tmpl = require('./templates/telll_btn.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="telll_btn-css">'+tmpl.css+'</style>').appendTo('head');
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

/**
* @return null
*/
TelllBtn.prototype.attach = function(){
    this._showWidget(this.t.store);
};

/**
* @return null
*/
TelllBtn.prototype.detach = function(){
    $('.telll-telll_btn-widget').detach();
    this.state = "detached";
};

/**
* @return null
*/
TelllBtn.prototype.close = function(){
    $('.telll-telll_btn-widget').fadeOut();
    this.state = "closed";
};

/**
* @return null
*/
TelllBtn.prototype.open = function(){
    $('.telll-telll_btn-widget').fadeIn();
    this.state = "open";
};

module.exports = {TelllBtn:TelllBtn};
