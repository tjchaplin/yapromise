"use strict";

var assert = require("assert");
var testFulfilled = require("./helpers/testThreeCases").testFulfilled;
var testRejected = require("./helpers/testThreeCases").testRejected;

var Action = require("../lib/action.js");
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
            
            action.actionState.toFulfilled();
            action.execute(value);
            
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

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality
console.log(promise);
describe("3.2.2: If `onFulfilled` is a function,", function () {
        describe("3.2.2.1: it must be called after `promise` is fulfilled, with `promise`’s fulfillment value as its " +
                 "first argument.", function () {
            testFulfilled(sentinel, function (promise, done) {
                promise.then(function onFulfilled(value) {
                    assert.strictEqual(value, sentinel);
                    done();
                });
            });
        });

    describe("3.2.2.2: it must not be called more than once.", function () {
        specify("already-fulfilled", function (done) {
            var timesCalled = 0;

            fulfilled(dummy).then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });
        });

        specify("trying to fulfill a pending promise more than once, immediately", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            tuple.fulfill(dummy);
            tuple.fulfill(dummy);
        });

        specify("trying to fulfill a pending promise more than once, delayed", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(dummy);
                tuple.fulfill(dummy);
            }, 50);
        });

        specify("trying to fulfill a pending promise more than once, immediately then delayed", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            tuple.fulfill(dummy);
            setTimeout(function () {
                tuple.fulfill(dummy);
            }, 50);
        });

        specify("when multiple `then` calls are made, spaced apart in time", function (done) {
            var tuple = pending();
            var timesCalled = [0, 0, 0];

            tuple.promise.then(function onFulfilled() {
                console.log("inner then");
                assert.strictEqual(++timesCalled[0], 1);
            });

            setTimeout(function () {
                console.log("first Time out");
                tuple.promise.then(function onFulfilled() {
                    assert.strictEqual(++timesCalled[1], 1);
                });
            }, 50);

            setTimeout(function () {
                console.log("second Time out");
                tuple.promise.then(function onFulfilled() {
                    console.log("inner second Time out");
                    assert.strictEqual(++timesCalled[2], 1);
                    done();
                });
            }, 100);

            setTimeout(function () {
                console.log("third Time out");
                tuple.fulfill(dummy);
            }, 150);
        });

        specify("when `then` is interleaved with fulfillment", function (done) {
            var tuple = pending();
            var timesCalled = [0, 0];

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled[0], 1);
            });

            tuple.fulfill(dummy);

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled[1], 1);
                done();
            });
        });
    });

    describe("3.2.2.3: it must not be called if `onRejected` has been called.", function () {
        testRejected(dummy, function (promise, done) {
            var onRejectedCalled = false;

            promise.then(function onFulfilled() {
                assert.strictEqual(onRejectedCalled, false);
                done();
            }, function onRejected() {
                onRejectedCalled = true;
            });

            setTimeout(done, 100);
        });

        specify("trying to reject then immediately fulfill", function (done) {
            var tuple = pending();
            var onRejectedCalled = false;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(onRejectedCalled, false);
                done();
            }, function onRejected() {
                onRejectedCalled = true;
            });

            tuple.reject(dummy);
            tuple.fulfill(dummy);
            setTimeout(done, 100);
        });
    
        specify("trying to reject then fulfill, delayed", function (done) {
            var tuple = pending();
            var onRejectedCalled = false;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(onRejectedCalled, false);
                console.log("fin");
                done();
            }, function onRejected() {
                onRejectedCalled = true;
            });

            setTimeout(function () {
                tuple.reject(dummy);
                tuple.fulfill(dummy);
            }, 50);
            setTimeout(done, 100);
        });

        specify("trying to reject immediately then fulfill delayed", function (done) {
            var tuple = pending();
            var onRejectedCalled = false;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(onRejectedCalled, false);
                console.log("fin2");
                done();
            }, function onRejected() {
                onRejectedCalled = true;
            });

            tuple.reject(dummy);
            setTimeout(function () {
                tuple.fulfill(dummy);
            }, 50);
            setTimeout(done, 100);
        });
    });
});
