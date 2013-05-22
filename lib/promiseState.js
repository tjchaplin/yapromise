(function(exports){	
	var PromiseState = function(){
		var self = this;

		self.isPending = false;
		self.isRejected = false;
		self.isFulfilled = false;
	};

	PromiseState.prototype.toPending = function(){
		var self = this;

		self.isPending = true;
		self.isRejected= false;
		self.isFulfilled = false;

		return self;
	};

	PromiseState.prototype.toFulfilled = function(){
		var self = this;

		self.isPending = false;
		self.isRejected= false;
		self.isFulfilled = true;

		return self;
	};

	PromiseState.prototype.toRejected = function(){
		var self = this;

		self.isPending = false;
		self.isRejected= true;
		self.isFulfilled = false;

		return self;
	};

	exports.toRejected = function(){
		return new PromiseState().toRejected();
	};

	exports.toFulfilled = function(){
		return new PromiseState().toFulfilled();
	};

	exports.toPending = function(){
		return new PromiseState().toPending();
	};
})(exports);