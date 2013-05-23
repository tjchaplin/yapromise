var promiseState = require("./promiseState.js");

var nextTick;

if (typeof setImmediate === "function")
	nextTick = function(next){setImmediate(next)};
else if (typeof process !== "undefined" && process.nextTick)
	nextTick = function(next){process.nextTick(next);};
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
	    	console.log("In next tick");
		    self.handlers.push({
		        onFulfilled: onFulfilled,
		        onRejected: onRejected
	    	})
		});

	    return self;
	};

	Promise.prototype.invoke = function(value) {
		var self = this;

		console.log("invoke:"+value);
		
		if(!self.currentState.isPending)
			return;

		if(self.handlers && self.handlers.length == 0)
			return self.fulfilled(value);

	    var handler = self.handlers.shift();
	    if (handler)
	    	self.invokeHanler(handler,value,function(value){self.invoke(value);});
	};
	
	Promise.prototype.invokeHanler = function(handler,handlerArguments,next){
		var self = this;
		var returnValue = {};

		try{
			if(handler.onFulfilled && handler.onFulfilled instanceof Function)
	    	{
	    		console.log("onFulfilled is a function");
	        	returnValue = handler.onFulfilled.apply(self,[handlerArguments]);
        		console.log("returnValue"+returnValue);
        		//TODO: check if value is a promise

        		next(returnValue);
	    	}
	    	else if(handler instanceof Function)
	    		self.invokeHandlerFunction(handler,handlerArguments,next);

		}catch(exception){
			self.rejected(exception);
		}

	};
	
	Promise.prototype.invokeHandlerFunction = function(handler,handlerArguments,next){
		var self = this;
		try{

			if(!handlerArguments || handlerArguments.length == 0)
				handlerArguments = [next];
			else
				handlerArguments = [handlerArguments,next];

			handler.apply(self,handlerArguments);

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