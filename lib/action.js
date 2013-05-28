var Next = require("./next.js");
var ActionState = require("./actionState.js");

(function(exports){
	"use strict";
	
	function Action(executable){
		var self = this;

		self.next = new Next();
		self.value = executable;
		self.executable = executable;
		self.actionState = new ActionState();

		return self;
	};
	
	Action.prototype.execute = function(){
		var self = this;
		var result = self.executable;
		console.log("execute:"+JSON.stringify(self.value));

		try{
			var parameters = self.addNextActionAsCallback(arguments);

			if(self.executable instanceof Function){
				result = self.executable.apply(self,parameters);
			}
			else if(self.executable){
				result = self.executable;
			}
			else
			{
				console.log("executable not defined");
				if(self.actionState.isPending)
					self.value = parameters[0];

				self.nextAction(parameters[0]);
				return self;
			}

		}catch(exception){
			console.log("exception"+exception);
			self.actionState.toRejected();
			result = exception;
		}
		
		// console.log(self.actionState);
		// console.log("setting value"+JSON.stringify(self.value)+" result:"+JSON.stringify(result));
		// if(result && self.actionState.isPending)
		// {
		// 	console.log("setting value"+JSON.stringify(result));
		// 	self.value = result;
		// 	self.actionState.toFulfilled();
		// }

		if(!self.actionState.isPending())
			self.nextAction(self.value);

		return self;
	};
	Action.prototype.nextAction = function(value){
		var self = this;
		
		if(self.actionState.isPending())
			self.actionState.toFulfilled();

		if(!self.next.hasNextAction()){
			console.log("no actions");
			self.value = value;
			return value;
		}

		var nextAction = self.next.getNextAction(self.actionState);
		if(nextAction instanceof Function){
			console.log("nextAction is a function:");
			self.executable = nextAction;
			return self.execute(value);
		}
		else{
			console.log("here3");
			self.value = nextAction;
			return nextAction;
		}
	};
	Action.prototype.addNextActionAsCallback = function(parameters){
		var self = this;

		var nextAction = function(value){self.nextAction(value);};
		var parameters = toArgumentArray(parameters);
		parameters[parameters.length] = nextAction;

		return parameters;
	};
	var toArgumentArray = function(parametersObject){
		
		var parameters = new Array(); 
	    for (var i = 0; i < parametersObject.length; i++) 
	        parameters[i] = parametersObject[i]; 

	    return parameters;
	};

	Action.prototype.then = function(onComplete,onError){
		var self = this;

	    process.nextTick(function(){
	    	console.log("In next tick");
	    	self.next.addAction(onComplete,onError)

	    	if(!self.actionState.isPending())
    			self.nextAction(self.value);
		});

		return self;
	};

	exports.create = function(executable){
		return new Action(executable);
	};

})(exports);