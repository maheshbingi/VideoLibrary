var utility = require("../utility");
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var State = require(utility.getModelsPath() + '/state');

var Address = function (street, city, state, zip) {
	this.street = street;
	this.city = city;
	
	this.state = new State(state);
	this.zip = zip;
}

/**
 * Creates Address object from http request object
 * @param req
 */
Address.prototype.createFromRequest = function(req) {
	this.street = req.param(Constants.STREET, null);
	this.city = req.param(Constants.CITY, null);
	
	this.state = new State();
	this.state.createFromRequest(req);
	this.zip = req.param(Constants.ZIP, null);
}

//Street
Address.prototype.setStreet = function(street) {
	this.street = street;
}

Address.prototype.getStreet = function() {
    return this.street;
}

// City
Address.prototype.getCity = function() {
    return this.city;
}

Address.prototype.setCity = function(city) {
	this.city = city;
}

// State
Address.prototype.getState = function() {
    return this.state;
}

Address.prototype.setState = function(state) {
	this.state = state;
}

// ZIP
Address.prototype.getZIP = function() {
    return this.zip;
}

Address.prototype.setZIP = function(zip) {
	this.zip = zip;
}

// Insert map
Address.prototype.getInsertValuesMap = function() {
	var insertValuesMap = {};
	insertValuesMap[DbConstants.STREET] = this.street;
	insertValuesMap[DbConstants.CITY] = this.city;
	insertValuesMap[DbConstants.ZIP_CODE] = this.zip;
	insertValuesMap[DbConstants.STATE_ID] = this.state.getId();
    return insertValuesMap;
}

Address.prototype.toJSON = function() {
	var address = {};
	address[Constants.STREET] = this.street;
	address[Constants.CITY] = this.city;
	address[Constants.STATE] = this.state.toJSON();
	address[Constants.ZIP] = this.zip;
	return address;
}

module.exports = Address;