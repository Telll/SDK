/**
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Clickbox(t){
    this.t = t;
    this._showWidget(t.store);
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
    $("#clickbox-ok").on( "photolinkSelected", function( e, data ) {
	me.detach();
        console.log('Clickbox closing ...');
        console.log(data);
        telll.setCookie('photolinkId',data.id,telll.conf.extime);
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


module.exports = {Clickbox:Clickbox};
