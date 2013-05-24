var should = require('should');
var Promise = require("../lib/promise.js");
var promiseState = require("../lib/promiseState.js");

describe('When promise state is fulfilled',function(){
	this.timeout(60000);

	it("should not transition to any other state",function(onComplete){

		var promise = Promise.create(function(cb){
			setTimeout(function(){
				console.log("Do Something");
				console.log(cb);

				if(cb)
					cb(5);

			},100);
		}).then(function(value){return value+1;})
			.then(function(value){return value+1;})
			.then(function(value){return value+1;});

		promise.invoke();

		setTimeout(function(){
			promise.isFulfilled().should.be.eql(true);
			promise.isPending().should.be.false;
			promise.isRejected().should.be.false;
			onComplete();
		}, 1000);
	});
	
});
