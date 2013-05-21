var should = require('should');
var Promise = require("../lib/promise.js");
var promiseState = require("../lib/promiseState.js");

describe('When promise state is pending',function(){
	this.timeout(60000);
	it("should be able to transition state to fulfilled",function(onComplete){
		var promise = Promise.create("testPromise");	
		
		setTimeout(function(){
			promise.isPending().should.be.false;
			onComplete();
		}, 100);
	});

	it("should be able to transition state to rejected",function(onComplete){
		var promise = Promise.create("testPromise");	
		promise.rejected();
		setTimeout(function(){
			promise.isPending().should.be.false;
			onComplete();
		}, 100);
	});
	
});
