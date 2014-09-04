var http = require('http');
var querystring = require('querystring');
var utility = require("./utility");
var Constants = require(utility.getConstantsPath());
var UNABLE_TO_CONNECT_MESSAGE = "Unable to connect to server";

var options = {
	host : 'localhost',
	port : 3000,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	method : 'POST'
};


exports.executeRequest = function(clientReq, clientRes) {
	if(clientReq.session.email) {
		clientReq.body.email = clientReq.session.email;
	}
	console.log(clientReq.body);
	
	var post_data = querystring.stringify(clientReq.body);
	options.path = clientReq.path;
	options.headers["Content-Length"] = post_data.length;
	
	var postRequest = http.request(options, function(res) {
		res.setEncoding('utf8');
		clientRes.writeHeader(res.statusCode, {'Content-Type' : 'application/json'});
		var buffer = '';
		res.on('data', function(data) {
			buffer += data;
			// console.log(data);
		});
		res.on('end', function(data) {
			// console.log("All data received");
			console.log(buffer);
			clientRes.write(buffer);			
			clientRes.end();
		});
	});
	postRequest.on('error', function(error) {
		
		clientRes.writeHeader(500, {'Content-Type' : 'application/json'});
		var errors = {};
		errors[Constants.STATUS] = false;
		if(error.message === 'connect ECONNREFUSED') {
			errors[Constants.ERRORS] = [UNABLE_TO_CONNECT_MESSAGE];
		} else {
			errors[Constants.ERRORS] = [error.message];
		}
		console.log(errors);
		clientRes.write(JSON.stringify(errors));
		clientRes.end();
	});

	postRequest.write(post_data);
	postRequest.end();
}

exports.execute = function(path, data, callBack) {
	var post_data = querystring.stringify(data);
	options.path = path;
	options.headers["Content-Length"] = post_data.length;

	var postRequest = http.request(options, function(res) {
		console.log("Response received --> " + path);
		res.setEncoding('utf8');
		res.on('data', function(data) {
			if(callBack != null) {
				callBack(JSON.parse(data), res.statusCode);
			}
		});
	});
	postRequest.on('error', function(error) {
		var errors = {};
		errors[Constants.STATUS] = false;
		if(error.message === 'connect ECONNREFUSED') {
			errors[Constants.ERRORS] = [UNABLE_TO_CONNECT_MESSAGE];
		} else {
			errors[Constants.ERRORS] = [error.message];
		}
		callBack(errors, 500);
	});
	postRequest.write(post_data);
	postRequest.end();
}
