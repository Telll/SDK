var Telll = require('./Telll.js').Telll;
/**
* Tests for telllSDK version 0.15
*/
exports.telllClasses = function(test){
    test.expect(2);
    var server = "127.0.0.1";
    var adManager = new Telll(server);
    test.ok(adManager, "Loads telll");
    test.ok(adManager.start());
    test.done();
};

/*
exports.testSomethingElse = function(test){
    test.ok(false, "this assertion should fail");
    test.done();
};
*/
