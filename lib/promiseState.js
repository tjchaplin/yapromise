(function(exports){	
	var PromiseState = function(){
		var self = this;

		self.isPending = false;
		self.isRejected = false;
		self.isFulfilled = false;
	};

	PromiseState.prototype.pending = function(){
		var self = this;

		self.isPending = true;
		self.isRejected= false;
		self.isFulfilled = false;

		return self;
	};

	PromiseState.prototype.fulfilled = function(){
		var self = this;

		self.isPending = false;
		self.isRejected= false;
		self.isFulfilled = true;

		return self;
	};

	PromiseState.prototype.rejected = function(){
		var self = this;
		
		self.isPending = false;
		self.isRejected= true;
		self.isFulfilled = false;

		return self;
	};

	exports.rejected = function(){
		return new PromiseState().rejected();
	};

	exports.fulfilled = function(){
		return new PromiseState().fulfilled();
	};

	exports.pending = function(){
		return new PromiseState().pending();
	};
})(exports);