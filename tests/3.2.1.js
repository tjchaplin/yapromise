var should = require('should');
var Promise = require("../lib/promise.js");
var promiseState = require("../lib/promiseState.js");

"use strict";

var promise = Promise.create();
var fulfilled = function(value){Promise.create().fulfilled(value);};;
var rejected = function(value){promise.rejected(value);};;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it

describe("3.2.1: Both `onFulfilled` and `onRejected` are optional arguments.", function () {
    describe("3.2.1.1: If `onFulfilled` is not a function, it must be ignored.", function () {
        function testNonFunction(nonFunction, stringRepresentation) {
            specify("`onFulfilled` is " + stringRepresentation, function (done) {
                Promise.create().rejected(dummy).then(nonFunction, function () {
                    done();
                });
            });
        }

        testNonFunction(undefined, "`undefined`");
        testNonFunction(null, "`null`");
        testNonFunction(false, "`false`");
        testNonFunction(5, "`5`");
        testNonFunction({}, "an object");
    });

    // describe("3.2.1.2: If `onRejected` is not a function, it must be ignored.", function () {
    //     function testNonFunction(nonFunction, stringRepresentation) {
    //         specify("`onRejected` is " + stringRepresentation, function (done) {
    //             var promise = Promise.create().fulfilled(dummy).then(function () {
    //                 console.log("complete");
    //                 done();
    //             }, nonFunction);
    //         });
    //     }

    //     testNonFunction(undefined, "`undefined`");
    //     testNonFunction(null, "`null`");
    //     testNonFunction(false, "`false`");
    //     testNonFunction(5, "`5`");
    //     testNonFunction({}, "an object");
    // });
});
