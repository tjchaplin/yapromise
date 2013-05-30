"use strict";

var assert = require("assert");
var testFulfilled = require("./helpers/testThreeCases").testFulfilled;
var testRejected = require("./helpers/testThreeCases").testRejected;
var Action = require("../lib/action.js");
var promise = Action.create();
promise.fulfilled = function(value){
    var action = Action.create();
    action.onComplete(value)
    return action;
};
promise.rejected = function(value){
    var action = Action.create();
    action.onError(value)
    return action;
};
promise.pending = function(){
        var action = Action.create();
        console.log("in pending"+JSON.stringify(action.actionState));
        var fulfill = function(value){
            action.onComplete(value)
            return action;
        };
        var reject = function(value){
            action.onError(value)
            return action;
        };
        return { promise : action, 
                fulfill : fulfill, 
                reject : reject };
};
var fulfilled = promise.fulfilled;
var rejected = promise.rejected;
var pending = promise.pending;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it

describe("3.2.4: `then` must return before `onFulfilled` or `onRejected` is called", function () {
    testFulfilled(dummy, function (promise, done) {
        var thenHasReturned = false;

        promise.then(function onFulfilled() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;
    });

    testRejected(dummy, function (promise, done) {
        var thenHasReturned = false;

        promise.then(null, function onRejected() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;
    });
});
