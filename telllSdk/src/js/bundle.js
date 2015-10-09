(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* Generated On: 2015-10-8
* Class: Movie
*/

function Movie(){
    //Constructor


}



module.exports = {Movie:Movie};
},{}],2:[function(require,module,exports){
/**
* Generated On: 2015-10-8
* Class: Photolink
*/

function Photolink(){
    //Constructor


}



module.exports = {Photolink:Photolink};
},{}],3:[function(require,module,exports){
/**
* Generated On: 2015-10-8
* Class: Telll
*/

function Telll(){
    //Constructor


}


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.login = function(data){
    //TODO: Implement Me 

};


/**
* @return {null}
*/
Telll.prototype.start = function(){
    //TODO: Implement Me 

};


/**
* @param movieId {} 
* @return {null}
*/
Telll.prototype.getMovie = function(movieId){
    //TODO: Implement Me 

};


/**
* @param plId {} 
* @return {null}
*/
Telll.prototype.getPhotolink = function(plId){
    //TODO: Implement Me 

};


/**
* @param trkId {} 
* @return {null}
*/
Telll.prototype.getTrackms = function(trkId){
    //TODO: Implement Me 

};


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.listPhotolinks = function(data){
    //TODO: Implement Me 

};


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.listMovies = function(data){
    //TODO: Implement Me 

};


/**
* @param data {} 
* @return {null}
*/
Telll.prototype.sendPhotolink = function(data){
    //TODO: Implement Me 

};



module.exports = {Telll:Telll};

},{}],4:[function(require,module,exports){
/**
* Generated On: 2015-10-8
* Class: Trackms
*/

function Trackms(){
    //Constructor


}



module.exports = {Trackms:Trackms};
},{}],5:[function(require,module,exports){
/**
* Generated On: 2015-10-8
* Class: User
*/

function User(){
    //Constructor


}



module.exports = {User:User};
},{}],6:[function(require,module,exports){
// telll SDK

var telllSDK = {};
telllSDK = require('./Telll.js');
telllSDK.TWS = {};
telllSDK.View = {};
telllSDK.TWS.Movie = require('./Movie.js').Movie;
telllSDK.TWS.User = require('./User.js').User;
telllSDK.TWS.Trackms = require('./Trackms.js').Trackms;
telllSDK.TWS.Photolink = require('./Photolink.js').Photolink;
telllSDK.View.tagPlayer = require('./Photolink.js').TagPlayer;
θ = telllSDK;
console.log(telllSDK);
console.log(θ.TWS);

},{"./Movie.js":1,"./Photolink.js":2,"./Telll.js":3,"./Trackms.js":4,"./User.js":5}]},{},[6]);
