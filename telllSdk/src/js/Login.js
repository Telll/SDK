/**
* View Login, implements the login widget using the mustache template login_template.mtjs
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Login(t){
    this.t = t;
    this._showLoginWidget(t.credentials);

    $("#login-ok").on( "loginDone", function( e, data ) {
        // Authenticate device 
        t.auth(data);
    });
}

/**
* @param data {} 
* @return bool
*/
Login.prototype._showLoginWidget = function(data){
    console.log('Showing the login widget');
    var tmpl = require('./templates/login_template.mtjs');
    var html = Mustache.render(tmpl.html, data);
    $('<style id="login-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');
    var telll = this.t;
    var me = this;
    $("#login-ok").on( "authOk", function( e, data ) {
	me.detach();
        console.log('Setting cookies');
        console.log(data);
        telll.setCookie('username',data.username,telll.conf.extime);
        telll.setCookie('password',data.password,telll.conf.extime);
        telll.setCookie('auth_key',data.auth_key,telll.conf.extime);
        telll.setCookie('device',data.device,telll.conf.extime);
    });

    $( "#login-ok-button" ).click(function(e) {
        e.preventDefault();
	    var dataAuth = {
	        username: $('#email').val(),
	        password: $('#password').val()
	    };
        $( "#login-ok" ).trigger( "loginDone", dataAuth );
    });
    return true;
};

/**
* @return null
*/
Login.prototype.detach = function(){
    $('.telll-login-widget').detach();
};

module.exports = {Login:Login};
