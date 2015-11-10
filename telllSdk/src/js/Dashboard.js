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
    this.status = null;
    this._showWidget(t.store);
    return null;
}

/**
* @param data {} 
* @return bool
*/
Dashboard.prototype._showWidget = function(data){
    console.log('Showing the dashboard widget');
    var tmpl = require('./templates/dashboard.mtjs');
    var html = Mustache.render(tmpl.html, data);
    if (tmpl.css)
    $('<style id="dashboard-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    this.status = "open";
    var telll = this.t;
    var me = this;
    $( "#close-button" ).on("click", function(e) {
        e.preventDefault();
	// do stuff
	me.status = "sent";
	me.detach();
    });

    $(".dashboard-home li#user-profile").on("click", function(e){
	    console.log("Open user dashboard");
	    telll.getUser( null, function(d){
		    $("#userid-field").val(d.id);
		    $("#username-field").val(d.username);
		    $("#email-field").val(d.email);
	    });
            $("#user-dashboard").slideToggle("slow");
	    $("#user-dashboard .save-button").on("click", function(e){
		   var result = $("#user-dashboard form").serialize();
	           console.log(result);
	    });
    });

    $(".dashboard-home li#movies").on("click", function(e){
	    console.log("Open movies dashboard");
        $("#movies-dashboard").slideToggle("slow");
    });

    $(".dashboard-home li#photolinks").on("click", function(e){
	    console.log("Open photolinks dashboard");
        $("#photolinks-dashboard").slideToggle("slow");
    });

    $(".dashboard-home li#tags").on("click", function(e){
	    console.log("Open user dashboard");
        $("#tags-dashboard").slideToggle("slow");
    });

   $(".dashboard-home li#clicks").on("click", function(e){
	    console.log("Open clicks dashboard");
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
Dashboard.prototype.detach = function(){
    $('.telll-dashboard-widget').detach();
    this.status = "detached";
};

/**
* @return null
*/
Dashboard.prototype.close = function(){
    $('.telll-dashboard-widget').fadeOut();
    this.status = "closed";
};

/**
* @return null
*/
Dashboard.prototype.open = function(){
    $('.telll-dashboard-widget').fadeIn();
    this.status = "open";
};

module.exports = {Dashboard:Dashboard};
