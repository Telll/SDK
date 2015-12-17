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
    var tmpl = require('./templates/movies_list.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="movies-list-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    var telll = this.t;
    var me = this;

    // The popup 
    $('<div class="popup-overlay"></div>').appendTo('body');
    $('<div id="popup-movies-list" class="popup"></div>').appendTo('body');
    $(".telll-movies-list-widget").appendTo('#popup-movies-list').fadeIn();
    //$('#popup-movies-list').css('z-index','999');
    $('html').addClass('overlay');

    /* // other buttons
    $( ".tag-titlebar button.trackms" ).on("click", function(e) {
        e.preventDefault();
        // The draggable pointer
        me.drgPointer();
	me.status = "tracking";
	
    });
    $( ".tag-titlebar button.tag" ).on("click", function(e) {
        e.preventDefault();
        // The tag editor
        me.tagEditor();
	me.status = "tagging";
	
    });
    */
    $( ".movies-list-titlebar button.close" ).on("click", function(e) {
        e.preventDefault();
	// do stuff
	me.status = "selected";
	me.detach();
    });

    $( ".movie-thumb" ).on("click", function(e) {
        e.preventDefault();
        var movie = JSON.parse($(this).attr('data'));
        me.status = 'selected';
        me.emit(me.status, movie);
        telll.setCookie('movieId',movie.id,telll.conf.extime);
	me.detach();
    });
    
    // Movie labels
    $(".telll-movie-element").on("mouseenter", function () {
        $(this).find('.movie-label').fadeIn();
        $(this).find('.movie-label').css('cursor','pointer');
        var element = this;
        $(this).find('.movie-label').on('click',function(){
            $(element).find('img').trigger('click');
        });
    });
    $(".telll-movie-element").on("mouseleave", function () {
        $(this).find('.movie-label').fadeOut();
    });

    return true;
};

/**
* @return null
*/
MoviesList.prototype.detach = function(){
    $('.telll-movies-list-widget').detach();
    $('div.popup-overlay').detach();
    $('div#popup-movies-list').detach();
};

module.exports = {MoviesList:MoviesList};
