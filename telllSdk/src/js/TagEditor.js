require ('./iView.js');
/**
  * class TagEditor
  * 
  */
TagEditor = function (t)
{
  this._init (t);
}

TagEditor.prototype =Object.create(iView.prototype);

/**
 * _init 
 * @param t Telll object 
 */
TagEditor.prototype._init = function (t)
{
    this.t = t;
    this.time = 0; 
    this._showWidget(t.store);
    var me = this;
}

/**
 * 
 * @param player
 * @param callback
    *      
 */
TagEditor.prototype.sync = function (p, callback)
{
  this.t.syncPlayer(this, p, callback);
}

/**
* @param data {} 
* @return bool
*/
TagEditor.prototype._showWidget = function(data){
    console.log('Showing the tag editor widget');
    var tmpl = require('./templates/tageditor.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="tageditor-css">'+tmpl.css+'</style>').appendTo('head');
    $("div#telll-tageditor").css({'width':'100%','height':'100%'}); 
    $(html).appendTo('body');
    this.status = "open";
    var telll = this.t;
    var me = this;

    // The player TODO: not the MockPlayer!!! How to use Youtube or Projekktor?
    var myPlayer = new telllSDK.View.MockPlayer(telll);
    $('#movie-player').appendTo('#tags-dashboard');

    // The popup 
    $('<div class="popup-overlay"></div>').appendTo('body');
    $('<div id="popup-tags" class="popup"></div>').appendTo('body');
    $("#tags-dashboard").appendTo('#popup-tags').fadeIn();
    $('#popup-tags').css('z-index','999');
    $('html').addClass('overlay');
    me.sync(myPlayer);

    // other buttons
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
    $( ".tag-titlebar button.close" ).on("click", function(e) {
        e.preventDefault();
	// do stuff
	me.status = "sent";
	me.detach();
    });
}

/**
* @return null
*/
TagEditor.prototype.drgPointer = function(){
    // TODO: test if have a movie loaded
    alert('Click and draw to capture the movement!');
    var mouseX, mouseY, pntOfs, trackms;
    $(document).on("mousemove", function (e) {
    if ($('#popup-tags').length){
        mouseX = e.pageX;
        mouseY = e.pageY;
        pntOfs = $('#popup-tags').offset(); //TODO fix it, have an error of some pixels
        $('div.tag-pointer').css({
           left:  mouseX - pntOfs.left - 15,
           top:   mouseY - pntOfs.top - 15
        });
    }}); 
    var frameRate = 12; // the number of frames per second 
    var timeInterval = Math.round( 1000 / frameRate ); 
    var atimer = null;
    $("div.tag-pointer").on('mouseup', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        clearTimeout(atimer);
        $("div.tag-pointer").fadeOut(function(){
            alert('Captured!');
            console.log(trackms);
            // Save data on tws
        });
    });
    $("div.tag-pointer").fadeIn();
    $("div.tag-pointer").on('mousedown', function(e){
        e.preventDefault();
        e.stopPropagation();
        trackms = []; 
        atimer = setInterval( function (t){
            // get the mouse data each time period
            trackms.push({
                  x: mouseX - pntOfs.left - 15,
                  y: mouseY - pntOfs.top - 15,
                  t: me.time
            });
        }, timeInterval ); 
    });
};

/**
* @return null
*/
TagEditor.prototype.attach = function(){
    this._showWidget(this.t.store);
};

/**
* @return null
*/
TagEditor.prototype.tagEditor = function(){
    console.log('Implement tag editor!!!!');
};


/**
* @return null
*/
TagEditor.prototype.detach = function(){
    //$('div#tags-dashboard').detach();
    $('div.popup-overlay').detach();
    $('div#popup-tags').detach();
    this.status = "detached";
};

/**
* @return null
*/
TagEditor.prototype.close = function(){
    $('.telll-tag-editor-widget').fadeOut();
    this.status = "closed";
};

/**
* @return null
*/
TagEditor.prototype.open = function(){
    $('.telll-tag-editor-widget').fadeIn();
    this.status = "open";
};


module.exports = {TagEditor:TagEditor};
