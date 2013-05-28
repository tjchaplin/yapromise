"use strict";

var Action = require("../../lib/action.js");
var promise = Action.create();
promise.fulfilled = function(value){
    var action = Action.create(value);
    action.actionState.toFulfilled();
    return action;
};
promise.rejected = function(value){
    var action = Action.create(value);
    action.actionState.toRejected();
    return action;
};
var promise = Action.create();
promise.fulfilled = function(value){
    var action = Action.create(value);
    action.actionState.toFulfilled();
    return action;
};
promise.rejected = function(value){
    var action = Action.create(value);
    action.actionState.toRejected();
    return action;
};
promise.pending = function(){
        var action = Action.create();
        console.log("in pending"+JSON.stringify(action.actionState));
        var fulfill = function(value){
            if(!action.actionState.isPending())
                return action;
            
            action.execute(value);
            action.actionState.toFulfilled();

            return action;
        };
        var reject = function(value){
                
            if(!action.actionState.isPending())
                return action;

            action.actionState.toRejected();
            action.execute(value);
            
            return action;
        };
        return { promise : action, 
                fulfill : fulfill, 
                reject : reject };
};
var fulfilled = promise.fulfilled;
var rejected = promise.rejected;
var pending = promise.pending;

exports.testFulfilled = function (value, test) {
    specify("already-fulfilled", function (done) {
        test(fulfilled(value), done);
    });

    specify("immediately-fulfilled", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        tuple.fulfill(value);
    });

    specify("eventually-fulfilled", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        setTimeout(function () {
            tuple.fulfill(value);
        }, 50);
    });
};

exports.testRejected = function (reason, test) {
    specify("already-rejected", function (done) {
        test(rejected(reason), done);
    });

    specify("immediately-rejected", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        tuple.reject(reason);
    });

    specify("eventually-rejected", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        setTimeout(function () {
            tuple.reject(reason);
        }, 50);
    });
};
