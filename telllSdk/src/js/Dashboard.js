require ('./iView.js');
/**
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Dashboard(t){
    this.t = t;
    this._init(t);
}

Dashboard.prototype =Object.create(iView.prototype);

/**
* @param t {} 
* @return bool
*/
Dashboard.prototype._init = function(t){
    this.state = null;
    this.tagEditor = null;
    this.metricsPanel = null;
    t.store.df = t.conf.dashboardFields;
    this._showWidget(t.store);
    return null;
}

/**
* @param data {} 
* @return bool
*/
Dashboard.prototype._showWidget = function(data){
    var tmpl = require('./templates/dashboard.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="dashboard-css">'+tmpl.css+'</style>').appendTo('head');
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

    // open dashboard forms
    // setup behaviors
    // TODO create functions or classes for each dashboard form

    ///////////////////////
    // user form
    $(".dashboard-home li#user-profile").on("click", function(e){
	// load user data
        me.loadUser();
        $('.dashboard-panel').hide();
        $("#user-dashboard").slideToggle("slow");
    });
    // user form behaviors
    $('#user-dashboard input.save-button').on('click', function(e){
        telll.saveUser($('#user-dashboard form#dashboard_form_user').serializeArray(), function(e,d){
             me.loadUser();
             me.timeDialog("User data saved ...", 1600);
	});

    });
    $('#user-dashboard input.delete-button').on('click', function(e){
        console.log(confirm("Do you really want to delete your account? It can't de undone"));
    });
    ////////////////////////
    // movies form
    $(".dashboard-home li#movies").on("click", function(e){
        $('.dashboard-panel').hide();
        // load description input onto textarea and limit length
        var $input    = $('#description-field');
        var $textarea = $('<textarea maxlength=255 id="decription-field" cols=40 rows=10 name="description"></textarea>');
        $textarea.attr('id', $input.attr('id'));
        $textarea.val($input.val());
        $input.replaceWith($textarea);
	$textarea.on('keyup blur', function() {
	    var maxlength = $(this).attr('maxlength');
	    var val = $(this).val();
	    if (val.length > maxlength) {
		$(this).val(val.slice(0, maxlength)); // limit field length
	    }
	});
        // create image field
        if (!$('img#movie-image').length){
        $("<img id='movie-image'>").insertBefore("#image-field");
        $("#movie-image").attr('src',$("#image-field").val());
        }
        // create the file upload field
        if (!$('input#movie-image-upload').length){
        $("<input type='file' id='movie-image-upload'>").insertAfter("#image-field");
        $("#movie-image-upload").on("change", function(e){
            console.log($(this));
            console.log(telll.user);
            var username = telll.credentials.username;
            var file = this.files[0];
            var fd = new FormData();
            fd.append("imagefile", file);
            fd.append("username", username);
            $.ajax({
              url: telll.conf.upload,
              type: "POST",
              data: fd,
              enctype: 'multipart/form-data',
              processData: false, 
              contentType: false 
            }).done(function( data ) {
                console.log("Upload output:");
                var json = JSON.parse(data);
                console.log( json );
                if (json.error){ 
                    me.timeDialog("Error: "+json.error+" ...<br> Contact the telll administrator.", 8000);
                } else {
                    // Change image field
                    $("#image-field").val(telll.conf.home+json.url);
                    $("#movie-image").attr('src',$("#image-field").val());
                    me.timeDialog("Image uploaded: "+json.url, 1600);
                }
            });
        });
        }
        me.reloadSelectMovies();
        $("#movies-dashboard").slideToggle("slow");
    });
    // movies form behaviors
    $('#movies-dashboard input.save-button').on('click', function(e){
        if ($("#description-field").val().length > 255) {
            alert ("Description field has "+$("#description-field").val().length+" caracters. It must have less than 256 caracters. Fix it please!");
            return;
        }
        telll.saveMovie($('#movies-dashboard form#dashboard_form_movie').serializeArray(), function(e,d){
             me.reloadSelectMovies();
             me.timeDialog("Movie saved ...", 1600);
	});
    });
    $('#movies-dashboard input.delete-button').on('click', function(e){
        if(confirm('Do you really want to delete this movie? It can\'t be undone.'))
            telll.deleteMovie($('#movies-dashboard form#dashboard_form_movie').serializeArray(), function(e,d){
                me.reloadSelectMovies();
		//Clear all fields
		$("#movies-dashboard fieldset input:text").val("");
		$("#movies-dashboard fieldset #player-select").val(0);
                me.timeDialog("Movie deleted ...", 1600);
	});
    });

    $("#movies-dashboard #movie-select").on('change', function(e){
	$( "#movies-dashboard #movie-select option:selected" ).each(function() {
            if ($(this).val() == 'clear' ){
		//Clear all fields
		$("#movies-dashboard fieldset input:text").val("");
		$("#movies-dashboard fieldset #player-select").val(0);
		//$("#movies-dashboard fieldset #movie-select").val('clear');
	    } else if ($(this).val() != 'none') {
		// Get movie data
		var myVal = $(this).val();
		var selMv = $.grep(telll.moviesList, function(e){
			return e.id == myVal; 
		});
		// Load the movie data into form fields
		$.each(selMv[0], function (name,value){
                    $("#movies-dashboard fieldset #"+name+"-field").val(value);
		});
                // load image
                $("#movie-image").attr('src',$("#image-field").val());
	    }
        });
    });


    ////////////////////////////
    // photolinks form
    $(".dashboard-home li#photolinks").on("click", function(e){
        $('.dashboard-panel').hide();
        $("#photolinks-dashboard").slideToggle("slow");
    });

    ////////////////////////////
    // Tags dashboard
    // open in a popup window
    $(".dashboard-home li#tags").on("click", function(e){
        me.tagEditor = new telllSDK.View.TagEditor(telll);
	me.state = "tagging";
    });

     ////////////////////////////
    // Metrics dashbard
    $(".dashboard-home li#clicks").on("click", function(e){
        $('.dashboard-panel').hide();
        $("#clicks-dashboard").slideToggle("slow");
    });

    return true;
};

/**
* @return null
*/
Dashboard.prototype.attach = function(){
    this._showWidget(this.t.store);
};

/**
* @return null
*/
Dashboard.prototype.reloadSelectMovies = function(){
        var telll = this.t;
        // Reload select widget	
        $("#movies-dashboard #movie-select").html('');
        $("#movies-dashboard #movie-select").append($('<option value="none">Select a movie:</option>'));
        $("#movies-dashboard #movie-select").append($('<option value="clear">[Create new movie]</option>'));
	// Load movies list from telll server
	telll.listMovies( null, function(d){
		$.each(d, function(i,j){
	            $("#movies-dashboard #movie-select").append(
			    $('<option value="'+j.id+'">'+j.title+'</option>'));
		});
	});

};

/**
* @return null
*/
Dashboard.prototype.loadUser = function(){
        var telll = this.t;
	telll.getUser( null, function(d){
	        $("#user-dashboard #userid-field").val(d.id);
	        $("#user-dashboard #username-field").val(d.username);
	        $("#user-dashboard #email-field").val(d.email);
	        $("#user-dashboard #password-field").val(d.password);
	});
};

/**
* @return null
*/
Dashboard.prototype.detach = function(){
    $('.telll-dashboard-widget').detach();
    this.state = "detached";
};

/**
* @return null
*/
Dashboard.prototype.close = function(){
    $('.telll-dashboard-widget').fadeOut();
    this.state = "closed";
};

/**
* @return null
*/
Dashboard.prototype.open = function(){
    $('.telll-dashboard-widget').fadeIn();
    this.state = "open";
};

/**
* @return null
* @param msg
*/
Dashboard.prototype.timeDialog = function(msg, delay){
    $("<div class='time-dialog'>"+msg+"</div>").appendTo("body").fadeIn(function(){
        setTimeout(function(){
             $(".time-dialog").fadeOut(function(){$(".time-dialog").detach();})
        }, delay);
    });
};


module.exports = {Dashboard:Dashboard};
