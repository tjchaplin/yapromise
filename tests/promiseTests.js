var should = require('should');
var Promise = require("../lib/promise.js");

var fs = require('fs');
 
var loadTestData = function(fileName,onLoaded){
	var file = __dirname + "/"+fileName;
	fs.readFile(file, 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    return;
	  }
	  data = JSON.parse(data);
	  onLoaded(data);
	});
}

var doStuff = function(results, currentIndex){
	var self = this;
	console.log("doStuff:"+currentIndex);
	
    var promise = new Promise.Promise(this);
	console.log("afterinit");
    setTimeout(function() {	
        results.push(currentIndex);
        promise.resolve(results,currentIndex+1);
    }, 1000);

    return promise;
}


var done = function(){
	var self = this;
	
	var ds1 = doStuff;
	var ds2 = doStuff;
	var ds3 = doStuff;
	var end = function(results){console.log("end:"+results); return results;}

	return doStuff([],0).then(ds2).then(ds3).then(end);
};

describe('When using promises',function(){
	this.timeout(60000);
	
	it("should be able to chain calls",function(onComplete){
		var results = done();

		setTimeout(function(){
			console.log(results.value);
			onComplete();
		}, 10000);
	});
	
});

