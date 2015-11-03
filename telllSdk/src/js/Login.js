const util = require('util');
const EventEmitter = require('events');
/**
* View Login, implements the login widget using the mustache template login_template.mtjs
* It has 3 states: 
* - "loginWait" - The widget was shown
* - "LoginDone" - The user filled fields and clicked login button
* - "authOk"    - User authenticated
* 
* The view emits an event with the same name of status when reached.
*
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Login(t){
    this.t = t;
    this._init();
}
util.inherits(Login, EventEmitter);

/**
 * Init widget
 */
Login.prototype._init = function () {
    this._showLoginWidget(this.t.credentials);
    EventEmitter.call(this);
    this.state = "loginWait";
    this.emit(this.state);
    //console.log(this.state);
    //console.log((new Date()).getTime());
}

/**
* @param data {} 
* @return bool
*/
Login.prototype._showLoginWidget = function(data){
    // Create widget
    //console.log('Showing the login widget');
    var tmpl = require('./templates/login_template.mtjs');
    var html = Mustache.render(tmpl.html, data);
    $('<style id="login-css">'+tmpl.css+'</style>').appendTo('head');
    $(html).appendTo('body');

    // Behaviors
    var telll = this.t;
    var me = this;
    this.on( "authOk", function( data ) {
	me.detach();
        //console.log('Setting cookies');
        //console.log(data);
        telll.setCookie('username',data.username,telll.conf.extime);
        telll.setCookie('password',data.password,telll.conf.extime);
        telll.setCookie('auth_key',data.auth_key,telll.conf.extime);
        telll.setCookie('device',data.device,telll.conf.extime);
    });
    var authOk = function ( error, data ){ 
            if (error) return alert(error);
	    me.state = 'authOk';
            var d = telll.credentials;
            for (var a in data) { d[a] = data[a]; }
            data = d;
	    me.emit(me.state, data);
	    //console.log(me.state);
            //console.log((new Date()).getTime());
            //console.log(me);
            //console.log(data);

    }; 
    this.on( "loginDone", function( data ) {
	    //console.log('Clicked on Login ... ');
        // Authenticate device via ws or rest
        via = window.WebSocket != undefined ? "ws" : "lp";
        if (via == 'ws') {
            //console.log('Login via WS ...');
            //console.log('Websocket opened, initating login ...');
            telll.wsAuth( data, authOk );
        }
	else {
            telll.auth(data, authOk);
        }
    });

    // Listen user action
    $( "#login-ok-button" ).click(function(e) {
        e.preventDefault();
	var dataAuth = {
	    username: $('#email').val(),
	    password: $('#password').val()
	};
	me.state = 'loginDone';
	//console.log(me.state);
        //console.log((new Date()).getTime());
        me.emit( me.state, dataAuth );
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
