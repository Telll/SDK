require ('./iView.js');
/**
* Generated On: 2015-10-8
* Class: PhotolinksList
* @param t {Telll} The telll object
* @constructor
*/
function PhotolinksList(t){
    this.t = t;
    this._init(t);
}

PhotolinksList.prototype =Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
*/
PhotolinksList.prototype._init = function(t){
    this.state = null;
    var me = this;
    t.getPhotolinksOfMovie(t.movie.id, function(pl){
       me.list = pl;
       me._showWidget(t.store);
    });
    return null;
};


/**
* Create the widget
* @param data {} 
* @return bool
*/
PhotolinksList.prototype._showWidget = function(data){
    var tmpl = require('./templates/panel.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="panel-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    this.state = "open";
    this.emit(this.state, this.list);
    var telll = this.t;
    var me = this;
/*
    $( "#close-button" ).on("click", function(e) {
        e.preventDefault();
	// do stuff
	me.state = "sent";
	me.detach();
    });
*/
    $("div#telll-controls").fadeIn();


    // Fill panel with photolinks
    //photolinks = myPhotolinks;
    //console.log(photolinks);
    //$("#panel-slider").html(""); // clean panel

    
    
    
    /*	    for (i = 0; i < photolinks.length; ++i) {
	       //console.log(photolinks[i]);
	       $("#panel-slider").append('<div class="frame-icon"><img class="photolink-icon" id="icon_'+photolinks[i].id+'" src="'+photolinks[i].thumb+'" id_photolink='+photolinks[i].id+'><label for="icon_'+photolinks[i].id+'">'+photolinks[i].links[0].title+'<label></div>');
	    }
            // mouse out : labels
            $(".frame-icon *").on("mouseover",function(e){
                 var thisid=$( this ).attr('id');
                 //console.log(thisid);
                 $('label[for='+thisid+']' ).css("display","inline");
            });
            $(".frame-icon *").on("mouseleave",function(e){
                 $('label').css("display","none");
            });
            // touch : labels
            $(".frame-icon *").on("touchstart",function(e){
                 var thisid=$( this ).attr('id');
                 //console.log(thisid);
                 $('label[for='+thisid+']' ).css("display","inline");
            });
            $(".frame-icon *").on("touchend",function(e){
                 $('label').css("display","none");
            });
/*
            $(".frame-icon *").click(function() {
                sendPhotolink($(this).attr('id_photolink'));
            });
            //$('.frame-icon *').dblclick(function (e) {
*/

/*            $('.frame-icon *').doubletap( function (e) {
                console.log('Double Click!!!');
                thePlayer.setPause();
                var ap = parseInt($(e.srcElement).attr('id_photolink'));
                // show dialog with photolinked webpage
                $('body').append('<div id="ph-dialog-'+ap+'"><iframe width="100%" height="100%" src="js/projekktor/themes/maccaco/buffering.gif"/></div>');
                //path = '/cgi-bin/mirror.pl?url='+myPhotolinks[ap].links[0].url;
                path = myPhotolinks[ap].links[0].url;
                $( "#ph-dialog-"+ap+" iframe" ).attr('src', path);
                $( "#ph-dialog-"+ap ).dialog({
                       modal: true,
                       width: '80%',
                       height: theHeight - 5,
                       title: myPhotolinks[ap].links[0].title,
                       buttons: {
                	 "See in the movie": function() {
                           var position = trackms[ap].points[0].t;
                	   $( this ).dialog( "close" );
                           thePlayer.setPlay();
                           setTimeout(function(){
                           thePlayer.setPlayhead(Number(position.toString()));
                           actualPhotolink = ap;
                           },500);
                           $("<div data-role='popup' class='telll-popup'>Searching tag on movie ...</div>").appendTo('body');
                           $( ".telll-popup" ).popup();
                           $( ".telll-popup" ).popup( "open", null );
                           setTimeout(function(){
                               $( ".telll-popup" ).popup('close');
                               $( ".telll-popup" ).detach();
                           },2000);

                	 }
                       }
                });
                $( "#ph-dialog-"+ap ).dialog( "open" );
            }, function(e){
              console.log('Single Click!!!');
              var ap = parseInt($(e.srcElement).attr('id_photolink'));
              console.log('Sendind Photolink ');
              console.log(this);
              sendPhotolink(ap);
            },400);
            //highlightPhotolink(0);
    }
    function scrollPhotolinksPanel(n){
            //console.log("Scrolled by:");
            //console.log(n);
            highlightedPhotolink += n;
            //console.log("Highlighted Photolink:");
            //console.log(highlightedPhotolink);
	    pls = $("#panel").find('.frame-icon img');
            //console.log(pls);
            // Catching some errors
            if (highlightedPhotolink > pls.length-1){
                highlightedPhotolink = parseInt(pls.length)-1;
            }
            if (highlightedPhotolink < 0){
                highlightedPhotolink = 0; 
            }
            
            highlightPhotolink(highlightedPhotolink);

            // Scroll panel to position
            // claculate offset
            var ml = 0;
            pls.each(function(i){
                if (parseInt(pls.eq(i).attr('id_photolink')) < highlightedPhotolink - Math.round(phListSize/2) 
                //   && highlightedPhotolink < parseInt(pls.length) - Math.round(phListSize/2)
                ){
                    ml ++; 
                }
            });
            var of = ml * phListElementWidth * -1;
            $('#panel-slider').animate({
                 'margin-left' : of+"px" 
            }, 400, function(){
	        //pls.eq(0).insertAfter(pls.eq(pls.length-1));
	        //pls.eq(0).css('margin-left',ml);
                //panelSliding = 0;
                console.log('Panel scrolled by: '+of);
            });

            /*
            if (highlightedPhotolink == 0){ highlightPhotolink(0); panelSliding = 0;return 0; }
            if (highlightedPhotolink == 1){ highlightPhotolink(1); panelSliding = 0;return 0; }
            if (highlightedPhotolink == 2){ highlightPhotolink(2); panelSliding = 0;return 0; }
            if (highlightedPhotolink == 3 && n === 1){ highlightPhotolink(3); panelSliding = 0;return 0; }
            if (highlightedPhotolink == pls.length-1){
                    highlightPhotolink(6); panelSliding = 0;return 0; }
            if (highlightedPhotolink == pls.length-2 ){
                    highlightPhotolink(5); panelSliding = 0;return 0; }
            if (highlightedPhotolink == pls.length-3){
                    highlightPhotolink(4); panelSliding = 0;return 0; }
            if (highlightedPhotolink == pls.length-4 && n === -1){
                    highlightPhotolink(3); panelSliding = 0;return 0; }
            ml = pls.css('margin-left');
            mwidth = '-120px';
            if (n === -1){
	        pls.eq(pls.length-1).insertBefore(pls.eq(0));
	        pls.eq(pls.length-1).css('margin-left',mwidth);
                pls.eq(pls.length-1).animate({
                            'margin-left': ml,
                            'transparency' : 0
                       }, 400, function(){
                           //panelSliding = 0;
                });
	    } else if (n === 1){
                pls.eq(0).animate({
                        'margin-left': mwidth,
                        'transparency' : 0
                   }, 400, function(){
	               pls.eq(0).insertAfter(pls.eq(pls.length-1));
	               pls.eq(0).css('margin-left',ml);
                       //panelSliding = 0;
                });
	    } else if (Math.abs(n) > 1) {
                for (i=0; i<Math.abs(n) ; i++){
                    setTimeout(function(){
                        scrollPhotolinksPanel(n/Math.abs(n));
                    },(i+1)*451);
                }
            }
            // done
           // restore photolinks
           setTimeout(function(){
               highlightPhotolink(3); panelSliding = 0;
           },450);
           */


    return true;
};

/**
 *
 */
PhotolinksList.prototype.highlightPhotolink = function(n){
    var pls = $("#panel").find('.frame-icon img');
    console.log('---> '+n);
    console.log(pls.eq(n));
    pls.each(function(i){
        //console.log(pls.eq(i).attr('id_photolink'));
        //newSrc = pls.eq(i).find('img').attr('src').replace("_green.jpg", ".jpg");
        //pls.eq(i).find('img').attr('src', newSrc);
        if (parseInt(pls.eq(i).attr('id_photolink')) != n ){
            pls.eq(i).css('opacity', '0.3');
        } else {
            pls.eq(n).css('opacity', '1');
            console.log('highlighting '+n);
        }
    });
    // highlight actual photolink
    //newSrc = pls.eq(n).find('img').attr('src').replace(".jpg", "_green.jpg");
    //pls.eq(n).find('img').attr('src', newSrc);
    //pls.eq(n).css({'width':'96px','height':'52px'});
};



module.exports = {PhotolinksList:PhotolinksList};
