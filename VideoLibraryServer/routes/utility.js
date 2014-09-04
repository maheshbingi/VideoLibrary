exports.getDbHandlerPath = function() {
	return __dirname + "/db/db-handler";
};

exports.getDbConstantsPath = function() {
	return __dirname + "/db/db-constants";
};

exports.getRedisCachePath = function() {
	return __dirname + "/db/redis-cache";
};

exports.getDbCreatorPath = function() {
	return __dirname + "/db/db-creator";
};

exports.getModelsPath = function() {
	return __dirname + "/models";
};

exports.getWebServicesPath = function() {
	return __dirname + "/webservices";
};

exports.getValidator = function() {
	return __dirname + "/validator";
};

exports.getConstantsPath = function() {
	return __dirname + "/constants";
};

exports.getCurrentDate = function() {
	return new Date();
};

/**
 * Generates membership if in 123-12-1234 format
 */
exports.generateMembershipId = function() {
	var membershipId = Math.random().toString();
	membershipId = membershipId.replace('0.', '');
	var part1 = membershipId.substring(0, 3);
	var part2 = membershipId.substring(3, 5);
	var part3 = membershipId.substring(5, 9);
	membershipId = part1 + '-' + part2 + '-' + part3;
	return membershipId;
};

/**
 * Calculates difference between months
 */
exports.monthDiff = function(d1, d2) {
	if(d2 == null) {
		d2 = this.getCurrentDate();
	}
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
};

var Constants = require(this.getConstantsPath());

/**
 * Writes success JSON response
 */
exports.writeSuccessJSON = function(response, data, message) {
	data[Constants.STATUS] = true;
	if(message != null) {
		data[Constants.MESSAGE] = message;
	}
	response.writeHead(200, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(data));
	response.end();
};

/**
 * Writes failure JSON response
 */
exports.writeFailureJSON = function(response, errorMessage) {
	var errors ={};
	errors[Constants.STATUS] = false;
	errors[Constants.ERRORS] = [errorMessage];
	response.writeHead(500, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(errors));
	response.end();
};

/**
 * Writes custom failure JSON response
 */
exports.writeCustomFailureJSON = function(response, errorJSON) {
	response.writeHead(500, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(errorJSON));
	response.end();
};