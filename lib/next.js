"use strict";

function Next(){
	var self = this;
	self.nextActions = [];
};

Next.prototype.hasNextAction = function(){return this.nextActions.length > 0;};

Next.prototype.addAction = function(onComplete,onError){
	var self = this;
	console.log("In addAction");
	
    self.nextActions.push({
        onComplete: onComplete,
        onError: onError
	});

	return self;
};


Next.prototype.getNextAction = function(state){
	var self = this;
	console.log("In getNextAction");

	if(!self.hasNextAction())
		return;

	var nextAction = self.nextActions.shift();
	if(state.isFulfilled())
		return nextAction.onComplete;

	if(state.isRejected())
		return nextAction.onError;

	return nextAction;

};

module.exports = Next;