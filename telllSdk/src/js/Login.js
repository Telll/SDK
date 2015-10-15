/**
* View Login, implements the login widget using the mustache template login_template.mtjs
* @param {Telll} t the telll object
* @author Monsenhor filipo at kobkob.org
* @constructor
*/
function Login(t){
    //Constructor
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
    // Load template from file, compile template, and render against data
    var tmpl = require('./templates/login_template.mtjs');
    var html = Mustache.render(tmpl.html, data);
    $(html).appendTo('body');
    // 
    $( "#login-ok-button" ).click(function(e) {
        e.preventDefault();
        $( "#login-ok" ).trigger( "loginDone", data );
    });
    return true;
};



module.exports = {Login:Login};
