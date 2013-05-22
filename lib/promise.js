var promiseState = require("./promiseState.js");

var nextTick;

if (typeof setImmediate === "function")
	nextTick = function(next){setImmediate(next)};
else if (typeof process !== "undefined" && process.nextTick)
	nextTick = function(next){process.nextTick};
else
	nextTick = function(next){ setTimeout(next, 0) };

(function(exports){
	"use strict";

	function Promise(promise) {
		var self = this;

	    if (promise instanceof Promise)
	        return promise;

	    self.currentState = promiseState.toPending();
	    self.result = {};

        self.handlers = [promise];

        return self;
	};

	Promise.prototype.value = function(){return this.result;}
	Promise.prototype.isPending = function(){return this.currentState.isPending};
	Promise.prototype.isRejected = function(){return this.currentState.isRejected};
	Promise.prototype.isFulfilled = function(){return this.currentState.isFulfilled};

	Promise.prototype.then = function(onFulfilled, onRejected) {
	    var self = this;
	    console.log("then");	
	    nextTick(function(){
		    self.handlers.push({
		        onFulfilled: onFulfilled,
		        onRejected: onRejected
	    	})
		});

	    return self;
	};

	Promise.prototype.invoke = function() {
		var self = this;
		console.log("invoke");
		if(!self.currentState.isPending)
			return;
		console.log("hanlder size:",self.handlers.length);
	    var handler = self.handlers.shift();
	    if (handler)
	    	self.invokeHanler(handler,arguments,function(){console.log("Called Back");});
	    else
	    	self.fulfilled(arguments);
	};
	
	Promise.prototype.invokeHanler = function(handler,handlerArguments,next){
		var self = this;
		var returnValue = {};

		if(!handlerArguments)
			handlerArguments = next;
		else
			handlerArguments = [handlerArguments,next];

		try{
	    	
	    	if(handler.onFulfilled && handler.onFulfilled instanceof Function)
	    	{
	    		console.log("onFulfilled is a function");
	        	returnValue = handler.onFulfilled.apply(self,handlerArguments);
	    	}
	    	if(handler instanceof Function)
	    	{
	    		console.log("handler is a function");
	        	returnValue = handler.apply(self,handlerArguments);
	        }
	        else
	        	{
	        		console.log("returnValue");
	        		returnValue = handler;			
	        	}

		}catch(exception){
			self.rejected(exception);
		}
	};

	Promise.prototype.fulfilled = function(value){
		var self = this;
		console.log("fulfilled");
		if(!self.currentState.isPending)
			return;

		if(self.handlers.length > 0)
			return self.invoke(value);

    	self.result = value;
    	self.currentState.toFulfilled();
	};

	Promise.prototype.rejected = function() {
		var self = this;
		console.log("rejected");
		if(!self.currentState.isPending)
			return;

    	self.currentState.toRejected();

	    var handler = self.handlers.shift();
	    if (handler && handler.onRejected) {
	    	if(handler instanceof Function)
	        	handler.onRejected.apply(self, arguments);
	    }
	};

	Promise.prototype.pending = function() {
		var self = this;

		if(!self.currentState.isPending)
			return;

		self.currentState = promiseState.toPending();

		return {promise:self, fulfill:self.fulfilled, reject: self.rejected};
	};

	exports.create = function(promise){
		return new Promise(promise);
	};

})(exports);