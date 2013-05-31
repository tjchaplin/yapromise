var should = require('should');
var Promise = require("../lib/promise2.js");
var promiseState = require("../lib/promiseState.js");

var adapter = function(){
	var self = this;

	var promise = Promise.create();
	self.fulfilled = function(value){promise.fulfilled(value);};
	self.rejected = function(value){promise.rejected(value);};
	self.pending = function(){promise.pending();};
	console.log(self);
};

var promisesAplusTests = require("promises-aplus-tests");
console.log(promisesAplusTests);

promisesAplusTests(Promise, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    console.log(err);
});