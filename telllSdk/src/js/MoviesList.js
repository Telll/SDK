require ('./iView.js');
/**
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function MoviesList(t){
    this.t = t;
    this._init(t);
}
MoviesList.prototype =Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
*/
MoviesList.prototype._init = function(t){
    this.status = null;
    this._showWidget(t.store);
    return null;
}

/**
* @param data {} 
* @return bool
*/
MoviesList.prototype._showWidget = function(data){
    console.log('Showing the movies list widget');
    var tmpl = require('./templates/movies_list.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="movies-list-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    var telll = this.t;
    var me = this;
    $( "#select-movie" ).on("change", function(e) {
        e.preventDefault();
	var data = {
           id:$("#select-movie").val(),
	};
	me.detach();
        //console.log('Movie selected');
        //console.log(data);
        me.status = 'sent';
        me.emit(me.status, data);
        telll.setCookie('movieId',data.id,telll.conf.extime);
    });

    return true;
};

/**
* @return null
*/
MoviesList.prototype.detach = function(){
    $('.telll-movies-list-widget').detach();
};

module.exports = {MoviesList:MoviesList};
