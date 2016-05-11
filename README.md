[![Stories in Ready](https://badge.waffle.io/Telll/SDK.png?label=ready&title=Ready)](https://waffle.io/Telll/SDK)

# Telll core SDK.

The SDK is a collection of classes and helpers to communicate with telll TWS (REST and Websockets services) and implement the widgets used in telll webapp.

- [Download telllSDK.js](https://raw.githubusercontent.com/Telll/SDK/master/telllSdk/build/js/telllSDK.js)
- TWS docs: http://telll.github.io/tws/
- SDK jsdoc:  http://telll.github.io/SDK/telllSDK

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
- 
- 

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

### 3. Add Code

#### a. Basic

This code bellow is the simplest way to load all telll widgets

```javascript
/* Basic telll load with jQuery*/
myMoviePlayer = $('#movie-player'); // the div (video or canvas) player id
myAdManager = new telllSDK.Telll(myMoviePlayer);
myAdManager.start();
```

#### b. Login
#### c. Load and display video ads
#### c. Load Widgets
##### c. Photolinks list
##### c. Telll button
##### c. The clickbox
##### c. The Dashboard
