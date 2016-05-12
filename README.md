[![Stories in Ready](https://badge.waffle.io/Telll/SDK.png?label=ready&title=Ready)](https://waffle.io/Telll/SDK)

# Telll core SDK.

The SDK is a collection of classes and helpers to communicate with telll TWS (REST and Websockets services) and implement the widgets used in telll webapp.

- License: GPLAffero 3.0 https://github.com/Telll/SDK/blob/master/LICENSE
- Terms of Service: https://github.com/Telll/telll.github.io/wiki/Telll-Terms-of-Service
- [Download telllSDK.js stable](https://github.com/Telll/webapp/blob/master/www/js/telllSDK.js)
- TWS docs: http://telll.github.io/tws/
- SDK jsdoc:  http://telll.github.io/SDK/telllSDK
- Clone and develop: https://github.com/Telll/SDK

## Example implementation:

### App
http://webapp.telll.me/

### XDK project
https://github.com/Telll/webapp

## Important classes:

1. [Telll] (http://telll.github.io/SDK/telllSDK/Telll.html)
Facade class for telll commands

1. [Tws](http://telll.github.io/SDK/telllSDK/Tws.html)
Facade class for API helpers

1. [Auth](http://telll.github.io/SDK/telllSDK/Auth.html)
Authentication class

1. [TagPlayer](http://telll.github.io/SDK/telllSDK/TagPlayer.html)
View implementing the telll scheduling, sincronizes with a MockPlayer object.

1. [MockPlayer](http://telll.github.io/SDK/telllSDK/MockPlayer.html)
A simple iPlayer implementation for video tags. Syncs with a TagPlayer object.

## interfaces
[iView](http://telll.github.io/SDK/telllSDK/iView.html)
Widgets and UI

[iPlayer](http://telll.github.io/SDK/telllSDK/iPlayer.html)
Sync tool with a video tag

[iData](http://telll.github.io/SDK/telllSDK/iData.html)
Model interface for API data

## Helpers:
1. Tws.deleteMovie(data, id)

1. Tws.deletePhotolink(data, id)

1. Tws.deleteTrackmotion(data, id)

1. Tws.deleteUser(data, id)

1. Tws.getMovie()

1. Tws.getPhotolink()

1. Tws.getPhotolinksOfMovie()

1. Tws.moviesList()

1. Tws.readUserPhotolinks()

1. Tws.saveMovie(data, id)

1. Tws.savePhotolink(data, id)

1. Tws.saveTrackmotion(data, id)

1. Tws.saveUser(data, id)

1. Tws.self()

1. Tws.sendPhotolink()

1. Tws.setHeaders()

1. Tws.user()

## UI:
4. Telll.wsAuth(data)
5. Telll.login(data)
6. Telll.logout(data)
1. telll.showMoviePage(movie, cb) → {MoviePage}
1. telll.showTagPlayer(player)
2. telll.showTelllBtn(trkm)
3. telll.syncPlayer(tagPlayer, moviePlayer)
4. Telll.sendPhotolink(data)
5. Telll.showClickbox(data)
6. Telll.showMockPlayer()


# Integrations

### Technology: multimedia inline links
telllSDK is a library to manage multimedia inline links.

telllSDK can be very easy to use to integrate, manage and control non intrusive advertising in mobile application.

# javascript

The fulll javascript version is the file telllSDK.js that contains:
- jQuery 
- Browserify
- Mustache
- TV4
- The telll SDK framework

### 1. Download and compile

#### Requirements:
- node.js
- npm
- perl 5.10 or superior

Use the commands bellow in a terminal (Linux, OSX, CygWin)

```shell
git clone https://github.com/Telll/SDK.git
cd SDK/telllSDK/src/js
npm build
```

You can also launch a local development server:  
```shell
npm start
```

You have a working copy under build/js:

```shell
cd -
ls SDK/telllSDK/build/js

```
Copy it to your web server and begin using telll

### 2. Setup and configuration

```javascript
/* Basic telll load with jQuery*/
/* Example */
function exampleImplementation (){
console.log('Loading example implementation ...');

myAdTest = new telllSDK.Telll();
console.info('telll: ', myAdTest);
// We may do it for a simplest aproach
// myAdTest.start();

// Detect if local machine is off line each 3600 seconds
setInterval( function(){
 $.ajax({
   type: "GET",
   cache: null,
   url: "http://"+myAdTest.conf.host+"/ws"
 }).fail( function() {
   alert('Connection seems down! Please check your Internet.');
 });
},3600000);



// After login create the buttons
myAdTest.login(null, function(){
    // define the instance player
    var myPlayer = {"error":"Player not loaded!!!"};
    // create buttons
    $('<input type="button" value="Dashboard">').appendTo('body').on('click', function(){myAdTest.showDashboard()});
    $('<input type="button" value="Clickbox">').appendTo('body').on('click', function(){myAdTest.showClickbox()});
    $('<input type="button" value="Movies List">').appendTo('body').on('click', 
	    function(){
            // showMoviesList runs the callback after a movie is selected
		    myAdTest.showMoviesList(function(m){
                        console.log("Movie selected: "+m.getTitle());
                        console.log(m);
                    })
	    });
   $('<input type="button" value="Mock Player">').appendTo('body').on('click', 
	   function(){
            // showMockPlayer runs the callback after load
		   myAdTest.showMockPlayer( function(m){
                       myPlayer = m;       
		       console.log(m); 
		   })
	   });
    $('<input type="button" value="Telll Movie Player">').appendTo('body').on('click', function(){myAdTest.showMoviePlayer()});
    $('<input type="button" value="Youtube Player">').appendTo('body').on('click', function(){myAdTest.showYoutubePlayer()});
    $('<input type="button" value="Tag Player">').appendTo('body').on('click', 
	   function(){
            // showTagPlayer runs the callback after load
	           myAdTest.showTagPlayer( myPlayer, function(tp){ 
                           console.log(tp);
	           }) 
	   });
    $('<input type="button" value="Photolinks List">').appendTo('body').on('click', function(){
	    var list = myAdTest.showPhotolinksList();
	    setTimeout(function(){
	    console.log(list);
	    list.on("open", function(pl){
	        console.log("PL :", pl);
	    });},200);
    });
    $('<input type="button" value="Telll Button">').appendTo('body').on('click', function(){myAdTest.showTelllBtn()});
 
});
