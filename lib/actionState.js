var promiseState = require("./promiseState.js");

"use strict";

function ActionState(){
	var self = this;
	self.state = promiseState.toPending();
	return self;
};

ActionState.prototype.isPending = function(){return this.state.isPending};
ActionState.prototype.isRejected = function(){return this.state.isRejected};
ActionState.prototype.isFulfilled = function(){return this.state.isFulfilled};
ActionState.prototype.toRejected = function(){this.state = promiseState.toRejected();};
ActionState.prototype.toFulfilled = function(){this.state = promiseState.toFulfilled();};

ActionState.prototype.transitionState = function(){
	var self = this;

	if(self.state.isPending || !self.state.isRejected)
	{
		console.log("toFulfilled");
		self.state.toFulfilled();
	}
	else if(self.state.isPending || !self.state.isFulfilled)
	{
		console.log("toRejected");
		self.state.toRejected();
	}

	return self;
};

module.exports = ActionState;