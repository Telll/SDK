[![Stories in Ready](https://badge.waffle.io/Telll/SDK.png?label=ready&title=Ready)](https://waffle.io/Telll/SDK)

### Telll core SDK.

To integrate mobile and web apps with the telll player.

### telllSDK is a simple lib to manage non intrusive ads 
telllSDK can be very easy to use to integrate, manage and control non intrusive advertising in mobile application.<br/>

The toolkit has implementations in javascript and Swift.

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
/* Basic telll load */
myMoviePlayer = document.getElementById('movie-player'); // the div (video or canvas) player id
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

## Usage - Swift

### 1. Download and install the library files

### 2. Setup and Configuration

### 3. Add Code

#### a. Basic
#### a. Login
#### g. Load and display video ads

