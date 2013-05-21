var should = require('should');
var Promise = require("../lib/promise.js");
var promiseState = require("../lib/promiseState.js");

describe('When promise state is fulfilled',function(){
	this.timeout(60000);


	it("should not transition to any other state",function(onComplete){
		var promise = Promise.create("testPromise");
		promise.rejected();

		setTimeout(function(){
			promise.currentState.should.be.eql(promiseState.fulfilled());
			promise.isPending().should.be.false;
			promise.isRejected().should.be.false;
			onComplete();
		}, 100);
	});

	it("should have a value",function(onComplete){
		var result = "testPromise";
		var promise = Promise.create(result);	

		setTimeout(function(){
			promise.value().should.be.eql(result);
			onComplete();
		}, 100);
	});


	it("should have a value that wont change when reject called",function(onComplete){
		var result = "testPromise";
		var promise = Promise.create(result);	
		promise.rejected();

		setTimeout(function(){
			promise.value().should.be.eql(result);
			onComplete();
		}, 100);
	});
	
});
