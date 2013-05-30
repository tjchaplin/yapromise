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
		self.reference = 1;

		return self;
	};
	
	Action.prototype.execute = function(){
		var self = this;
		var result;
		console.log("execute:"+JSON.stringify(self.value));

		try{
			
			if(self.executable instanceof Function){
				console.log("executable is a function");
				result = self.executeFunction(self.executable,arguments);
			}
			else if(self.executable){
				console.log("executable is a value");
				result = self.executable;
			}
			else
			{
				console.log("no executable defined");
				result = parameters[0];
			}

		}catch(exception){
			console.log("exception"+JSON.stringify(exception));
			result = exception;
			self.onError(exception);
		}				
		
		console.log("after executable");
		self.onComplete(result);
		return self;
	};

	Action.prototype.onError = function(error){
		var self = this;

		self.actionState.toRejected();
		self.value = error;		
		self.nextAction(error);	

		return self;
	};

	Action.prototype.onComplete = function(value){
		var self = this;
		console.log("onComplete"+JSON.stringify(value)+" self:"+JSON.stringify(self));
		if(value instanceof Function)
			return self;

		self.value = value;
		
		if(self.actionState.isPending())
			self.actionState.toFulfilled();

		if(!self.actionState.isPending())
			self.nextAction(value); //should just be value

		return self;
	};

	Action.prototype.executeFunction = function(executable,parameters){
		var self = this;
		var parameters = self.addNextActionAsCallback(parameters);
		var result = executable.apply(self,parameters);
		return result;
	};

	Action.prototype.nextAction = function(value){
		var self = this;
		console.log("In nextAction");
		if(self.actionState.isPending()){
			console.log("Next action is fulfilling value");
			self.value = value;
			self.actionState.toFulfilled();
		}

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

	Action.prototype.then = function(ccc,onError){
		var self = this;
		
		var newAction = new Action();
		newAction.reference = self.reference+1;

	    process.nextTick(function(){
	    	console.log("In next tick");
	    	newAction.next.addAction(ccc,onError);

	    	self.next.addAction(
	    		function(value){
	    			console.log("calling newAction onComplete");
					newAction.onComplete(value);
					return value;
	    		},
		    	function(error){
					newAction.onError(error);
					return error;
		    	});

	    	if(!self.actionState.isPending())
    			self.nextAction(self.value);
		});

		return newAction;
	};

	exports.create = function(executable){
		return new Action(executable);
	};

})(exports);