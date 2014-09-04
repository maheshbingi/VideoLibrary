var utility = require("./utility");
var WebserviceHelper = require(utility.getWebServiceHelperPath());
var Constants = require(utility.getConstantsPath());

exports.signIn = function(req, res) {
	console.log("Session manager sign in");
	response = res;
	request = req;
	WebserviceHelper.execute('/signIn', req.body, onResponse);
};

/**
 * Destroys session
 */
exports.signOut = function(req, res) {
	console.log("Session manager sign out");
	response = res;
	req.session = null;
	var data = {};
	data[Constants.STATUS] = true;
	data[Constants.MESSAGE] = "Signed out successfully";
	writeResponse(data, 200);
};

exports.editPersonInfo = function(req, res) {
	console.log("Session manager edit user info");
	response = res;
	request = req;
	console.log(req.body);
	WebserviceHelper.execute('/editPersonInfo', req.body, onResponse);
};

/**
 * Stores email in session object on successful sign in
 * @param data
 * @param statusCode
 */
function onResponse(data, statusCode) {
	console.log(data);
	if(data.status) {
		request.session.email = data.email;
		console.log(request.session);
	}
	writeResponse(data, statusCode);
}

function writeResponse(data, statusCode) {
	response.writeHeader(statusCode, {"Content-Type": "application/json"});  
	response.write(JSON.stringify(data));  
	response.end();
}