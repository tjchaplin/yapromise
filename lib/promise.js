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

	    self.currentState = promiseState.pending();
	    self.result = {};

        self.handlers = [promise];
        self.invoke();
	};

	Promise.prototype.value = function(){return this.result;}
	Promise.prototype.isPending = function(){return this.currentState.isPending};
	Promise.prototype.isRejected = function(){return this.currentState.isRejected};
	Promise.prototype.isFulfilled = function(){return this.currentState.isFulfilled};

	Promise.prototype.then = function(onFulfilled, onRejected) {
	    var self = this;
	    
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
		console.log()
		if(!self.currentState.isPending)
			return;

	    var handler = self.handlers.shift();
	    if (handler)
	    	self.invokeHanler(handler,arguments);
	    else
	    	self.fulfilled();
	};
	
	Promise.prototype.invokeHanler = function(handler,handlerArguments){
		var self = this;
		var returnValue = {};

		try{
	    	
	    	if(handler.onFulfilled)
	        	returnValue = handler.onFulfilled.apply(self, handlerArguments);
	        else if(handler instanceof Function)
	        	returnValue = handler.apply(self,handlerArguments);
	        else
	        	returnValue = handler;			

	        if(self.handlers.length === 0)
	        	self.fulfilled(returnValue);

		}catch(exception){
			self.rejected(exception);
		}
	};

	Promise.prototype.fulfilled = function(lastHandlerResult){
		var self = this;

		if(!self.currentState.isPending)
			return;

    	self.result = lastHandlerResult;
    	self.currentState.fulfilled();
	};

	Promise.prototype.rejected = function() {
		var self = this;

		if(!self.currentState.isPending)
			return;

    	self.currentState.rejected();

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

		self.currentState = promiseState.pending();

		return {promise:self, fulfill:self.fulfilled, reject: self.rejected};
	};

	exports.create = function(promise){
		return new Promise(promise);
	};

})(exports);