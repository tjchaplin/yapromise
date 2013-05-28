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

	Promise.prototype.value = function(){return this.result;}
	Promise.prototype.isPending = function(){return this.currentState.isPending};
	Promise.prototype.isRejected = function(){return this.currentState.isRejected};
	Promise.prototype.isFulfilled = function(){return this.currentState.isFulfilled};

	var action = new Action(function(param){return param})
						.onComplete(function(value){

						})
						.onError(function(error){

						});

	var action = new Action(
			{action:function(param){return param},
			onComplete : function(value){lajfl},
			onError : function(value){lajfl}
			}
		);
	action.execute("alsdkfj",["jfkjfkfj","ksldfjl"]);
	var action = new Action(function(){},function(){});

	function Action(onCompleteCallback,onErrorCallback){
		var self = this;

		self.result = {};
		self.onErrorCallback = onErrorCallback;
		self.onCompleteCallback = onCompleteCallback;

		return self;
	};

	Action.prototype.onEnd(result,callback){
		var self = this;

		self.result = result;

		if(!callback)
			return self.result;

		if(!callback instanceof Function)
			return self.result;

		return callback(self.result);
	};

	Action.prototype.onComplete(completeValue){
		var self = this;
		return self.onEnd(completeValue,self.onCompleteCallback);
	};

	Action.prototype.onError(error){
		var self = this;
		return self.onEnd(completeValue,self.onErrorCallback);
	};

	Action.prototype.canExecute = function(executable){
		if(executable instanceof Function)
			return true;

		return false;
	};

	Action.prototype.execute = function(){
		var self = this;

		try{
			var result = {};
			if(self.canExecute(parameter))
				result = parameter()

			if(self.onComplete && self.onFulfilled instanceof Function
	    	{
	    		console.log("onFulfilled is a function");
	        	returnValue = handler.onFulfilled.apply(self,[handlerArguments]);
        		console.log("returnValue"+returnValue);
        		//TODO: check if value is a promise

        		next(returnValue);
	    	}
	    	else if(handler.onRejected && handler.onRejected instanceof Function && (self.currentState.isPending || self.currentState.isRejected))
	    	{
	    		handler.onRejected.apply(self,["Is rejected"]);
	    	}
	    	else if(handler instanceof Function)
	    		self.invokeHandlerFunction(handler,handlerArguments,next);

		}catch(exception){
			self.rejected(exception);
		}

	};

	function Promise(promise) {
		var self = this;

	    if (promise instanceof Promise)
	        return promise;

	    self.result = {};
	    self.actions = [];
	    self.currentState = promiseState.toPending();

        return self;
	};

	Promise.prototype.then = function(onFulfilled, onRejected) {
	    var self = this;
	    console.log("then");

	    nextTick(function(){
	    	console.log("In next tick");
	    	self.addAction(onFulfilled, onRejected);

	    	if(!self.currentState.isPending)
    			self.invoke(self.value);
		});

	    return self;
	};

	Promise.prototype.addAction = function(onFulfilled,onRejected){
	    self.actions.push({
	        onFulfilled: onFulfilled,
	        onRejected: onRejected
    	});
	};

	Promise.prototype.invoke = function(value) {
		var self = this;

		console.log("invoke:"+value);

		if(self.actions.length == 0)
			return self.fulfilled(value);

	    var handler = self.actions.shift();
	    if (handler)
	    	self.invokeHanler(handler,value,function(value){self.invoke(value);});
	};
	
	Promise.prototype.invokeHanler = function(handler,handlerArguments,next){
		var self = this;
		var returnValue = {};

		try{
			if(handler.onFulfilled && handler.onFulfilled instanceof Function && (self.currentState.isPending || self.currentState.isFulfilled))
	    	{
	    		console.log("onFulfilled is a function");
	        	returnValue = handler.onFulfilled.apply(self,[handlerArguments]);
        		console.log("returnValue"+returnValue);
        		//TODO: check if value is a promise

        		next(returnValue);
	    	}
	    	else if(handler.onRejected && handler.onRejected instanceof Function && (self.currentState.isPending || self.currentState.isRejected))
	    	{
	    		handler.onRejected.apply(self,["Is rejected"]);
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
		console.log("fulfilled"+value);

		if(!self.currentState.isPending)
			return;

		if(self.actions.length > 0)
			return self.invoke(value);

    	self.result = value;
    	self.currentState.toFulfilled();

    	return self;
	};

	Promise.prototype.rejected = function(value) {
		var self = this;
		console.log("rejected"+value);

		// if(!self.currentState.isPending)
		// 	return;

		console.log(self.actions);
    	self.currentState.toRejected();
	    var handler = self.actions.shift();
	    if (handler && handler.onRejected) {
	    	if(handler.onRejected instanceof Function)
	        	handler.onRejected.apply(self, arguments);
	    }

	    return self;
	};

	Promise.prototype.pending = function() {
		var self = this;

		if(!self.currentState.isPending)
			return;

		self.currentState = promiseState.toPending();

		return {promise:self, fulfill:self.fulfilled, reject: self.rejected};
	};

	Promise.prototype.execute = function(parameters){
		var self = this;

		self.invoke(parameters);	
	};

	exports.create = function(promise){
		return new Promise(promise);
	};

})(exports);