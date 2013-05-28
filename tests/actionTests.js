var should = require('should');
var Action = require("../lib/action.js");

var abc = function(){
	var self = this;
	self.value = "myValue";

	self.func1 = function(executable){
		var self  = this;
		console.log("In func1");
		executable.apply(self,[self.func2]);
	};

	self.func2 = function(){
		console.log("in func2"+self.value);
		
		self.value += 1;

		return self.value;
	};
}

describe('When action executing an action',function(){
	this.timeout(60000);

	// it("should not transition to any other state",function(onComplete){
	// 	var a = new abc();
	// 	a.func1(function(callback){console.log("Inner func1");callback();});
	// 	onComplete();

	// });

	// it("should not transition to any other state",function(onComplete){

	// 	var action = Action.create(function(asdf){
	// 		console.log("thing to execute:"+asdf); 
	// 		return 1;
	// 	});
	// 	var result = action.execute("adf").then();
	// 	console.log(result);
	// 	onComplete();
	// });

	// it("should not transition to any other state",function(onComplete){

	// 	var action = Action.create(function(asdf){
	// 		console.log("thing to execute:"+asdf); 
	// 		return 1;
	// 	});

	// 	var result = action.execute("adf")
	// 						.then(function(result){
	// 							console.log("IN THEN!!!!!!");
	// 							return result;
	// 						})
	// 						.then(function(result){
	// 							console.log("In THEN AFTER*********");
	// 							return result;
	// 						})

	// 	console.log(result);
	// 	onComplete();
	// });
	// it("should not transition to any other state",function(onComplete){

	// 	var action = Action.create(function(next2){
	// 		var self = this;
	// 		self.next2 = next2;

	// 		setTimeout(function(){
	// 			console.log("timeout function"); 
	// 			self.next2(1);
	// 		},500)
	// 	});

	// 	var result = action.execute()
	// 						.then(function(result){
	// 							console.log("IN THEN!!!!!!");
	// 							return result+1;
	// 						})
	// 						.then(function(result){
	// 							console.log("In THEN AFTER*********");
	// 							return result+1;
	// 						});
	// 	setTimeout(function(){
	// 		console.log(result.result);
	// 		onComplete();
	// 	}, 1000);

	// });

	it("should not transition to any other state",function(onComplete){

		var action2 = Action.create(function(next2){
			next2(1);
			//self.next2 = next2;

			// setTimeout(function(){
			// 	console.log("timeout function"); 
			// 	next2(1);
			// },500)
		});

		var action = Action.create(function(next2){next2(1);});
		var result = action.execute()
							.then(function(result){
								console.log("IN THEN!!!!!!");
								return result+1;
							})
							.then(function(result){
								console.log("In THEN AFTER*********");
								return result+1;
							});
		setTimeout(function(){
			console.log("test end");
			console.log(result.value);
			onComplete();
		}, 1000);

	});

});