var utility = require("../utility");
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var Address = require(utility.getModelsPath() + '/address');
var UserLogin = require(utility.getModelsPath() + '/user-login');
var Membership = require(utility.getModelsPath() + '/membership');
var DbConstants = require(utility.getDbConstantsPath());

var Person = function (id, firstName, lastName, email, password, ssn, membership, street, city, state, zip) {
	this.id = (id != null ) ? id : Constants.ERROR_ID;
	this.firstName = firstName;
	this.lastName = lastName;
	this.userLogin = new UserLogin(email, password);
	this.ssn = ssn;
	this.membership = new Membership(membership);
	this.address = new Address(street, city, state, zip);
	this.userLoginId = null;
}

/**
 * Creates Person object from http request object
 * @param req
 */
Person.prototype.createFromRequest = function(req) {
	this.id = req.param(Constants.PERSON_ID, Constants.ERROR_ID);
	this.firstName = req.param(Constants.FIRST_NAME, null);
	this.lastName = req.param(Constants.LAST_NAME, null);
	this.ssn = req.param(Constants.SSN, null);
	
	this.userLogin = new UserLogin();
	this.userLogin.createFromRequest(req);
	
	this.membership = new Membership();
	this.membership.createFromRequest(req);
	
	this.address = new Address();
	this.address.createFromRequest(req);
}

/**
 * Creates Person object from db resultset
 * @param rs
 */
Person.prototype.createFromResultset = function(rs) {
}

// User Login Id
Person.prototype.setUserLoginId = function(userLoginId) {
	this.userLoginId = userLoginId;
}

Person.prototype.getUserLoginId = function() {
    return this.userLoginId;
}

// Id
Person.prototype.setId = function(id) {
	this.id = id;
}

Person.prototype.getId = function() {
    return this.id;
}

// First name
Person.prototype.setFirstName = function(firstName) {
	this.firstName = firstName;
}

Person.prototype.getFirstName = function() {
    return this.firstName;
}

// Last name
Person.prototype.setLastName = function(lastName) {
	this.lastName = lastName;
}

Person.prototype.getLastName = function() {
    return this.lastName;
}

// User login
Person.prototype.setUserLogin = function(userLogin) {
	this.userLogin = userLogin;
}

Person.prototype.getUserLogin = function() {
    return this.userLogin;
}

// SSN
Person.prototype.setSSN = function(ssn) {
	this.ssn = ssn;
}

Person.prototype.getSSN = function() {
    return this.ssn;
}

// Address
Person.prototype.setAddress = function(address) {
	this.address = address;
}

Person.prototype.getAddress = function() {
    return this.address;
}

// Membership
Person.prototype.setMembership = function(membership) {
	this.membership = membership;
}

Person.prototype.getAddress = function() {
    return this.membership;
}

// List all persons query
Person.getListAllPersonsQuery = function() {
    return "SELECT " + "u." + DbConstants.ID + ", " + "p." + DbConstants.ID + " as " + Constants.PERSON_ID + ", " +
    "u." + DbConstants.IS_DISABLED + ", " + DbConstants.FIRST_NAME + ", " + DbConstants.LAST_NAME + ", " +
    "p." + DbConstants.MEMBERSHIP_ID + ", " + DbConstants.EMAIL + ", " + DbConstants.SSN + ", "  + DbConstants.PASSWORD + ", " +
    "m." + DbConstants.TYPE + " as " + Constants.MEMBERSHIP_TYPE + ", " +
    DbConstants.STREET + ", " + DbConstants.CITY + ", " + DbConstants.ZIP_CODE + ", " + DbConstants.STATE_ID + ", " + DbConstants.CODE +  ", " + DbConstants.NAME + ", " + 
    DbConstants.MEMBERSHIP_TYPE_ID + 
    " FROM " +
    	DbConstants.PERSON_TABLE + " p, " + DbConstants.STATE_TABLE + " s, " +
    	DbConstants.MEMBERSHIP_TABLE + " m, " + DbConstants.USER_LOGIN_TABLE + " u " +
    " WHERE " + 
    	"p." + DbConstants.USER_LOGIN_ID + " = " + "u." + DbConstants.ID +
    " AND " +
    	"p." + DbConstants.STATE_ID + " = " + "s." + DbConstants.ID +
    " AND " +
    	"p." + DbConstants.MEMBERSHIP_TYPE_ID + " = " + "m." + DbConstants.ID;
}

Person.getListSimpleCustomersQuery = function() {
    return this.getListAllPersonsQuery() + " AND " + "p." + DbConstants.MEMBERSHIP_TYPE_ID + " = " + 1;
}

Person.getListPremiumMembersQuery = function() {
    return this.getListAllPersonsQuery() + " AND " + "p." + DbConstants.MEMBERSHIP_TYPE_ID + " = " + 2;
}

// Member info
Person.prototype.getMemberInfoQuery = function() {
    return Person.getListAllPersonsQuery() + " AND " + "u." + DbConstants.EMAIL + " = " + "'" + this.getUserLogin().getEmail() + "'";
}

// Member type query
Person.prototype.getMemberTypeIdQuery = function() {
    return "SELECT " + DbConstants.MEMBERSHIP_TYPE_ID + " FROM " + DbConstants.PERSON_TABLE + " WHERE " +
    DbConstants.ID + " = " + this.getId();
}

// Member type query by email
/*Person.prototype.getMemberTypeIdByEmailQuery = function() {
    return "SELECT " + DbConstants.MEMBERSHIP_TYPE_ID + " FROM " + DbConstants.PERSON_TABLE + " p" + ", " +
    DbConstants.USER_LOGIN_TABLE + " u " + " WHERE " +
    "u." +  DbConstants.EMAIL + " = "  + "'" + this.getUserLogin().getEmail() + "'" +
    " AND " +
    "u." + DbConstants.ID + " = " + "p." + DbConstants.USER_LOGIN_ID;
}*/

// Insert map
Person.prototype.getValuesMap = function() {
	var insertValuesMap = {};
	if(this.userLoginId != null) {
		insertValuesMap[DbConstants.USER_LOGIN_ID] = this.userLoginId;
	}
	insertValuesMap[DbConstants.FIRST_NAME] = this.firstName;
	insertValuesMap[DbConstants.LAST_NAME] = this.lastName;
	insertValuesMap[DbConstants.SSN] = this.ssn;
	insertValuesMap[DbConstants.MEMBERSHIP_TYPE_ID] = this.membership.getIntId();
	insertValuesMap[DbConstants.STREET] = this.address.getStreet();
	insertValuesMap[DbConstants.CITY] = this.address.getCity();
	insertValuesMap[DbConstants.STATE_ID] = this.address.getState().getId();
	insertValuesMap[DbConstants.ZIP_CODE] = this.address.getZIP();
	insertValuesMap[DbConstants.MEMBERSHIP_ID] = utility.generateMembershipId();
    return insertValuesMap;
}

// Update query
Person.prototype.getUpdatePersonInfoQuery = function() {
	return "UPDATE " + DbConstants.PERSON_TABLE + " SET ? WHERE " + DbConstants.USER_LOGIN_ID + " = "  + this.userLogin.getId();
}

Person.prototype.toJSON = function() {
	var person = {};
	person[Constants.FIRST_NAME] = this.firstName;
	person[Constants.LAST_NAME] = this.lastName;
	person[Constants.EMAIL] = this.userLogin.getEmail();
	person[Constants.ADDRESS] = this.address.toJSON();
	return person;
}

Person.prototype.validateAll = function() {
	var validator = new Validator();
	validator.validateText(this.firstName, 'First Name', 45);
	validator.validateText(this.lastName, 'Last Name', 45);
	
	validator.validateEmail(this.userLogin.getEmail(), 'Email');
	validator.validateBlank(this.userLogin.getPassword(), 'Password');
	
	validator.validateMemberShip(this.membership.getId(), 'Membership Details');
	
	validator.validateSSN(this.ssn);
	
	validator.validateBlank(this.address.getStreet(), 'Street');
	validator.validateText(this.address.getCity(), 'City');
	validator.validateState(this.address.getState(), 'State');
	validator.validateZIP(this.address.getZIP(), 'ZIP');
	return validator.getErrorList();
}

// Update
Person.prototype.getUpdateValuesMap = function() {
	var updateValuesMap = {};
	updateValuesMap[DbConstants.FIRST_NAME] = this.firstName;
	updateValuesMap[DbConstants.LAST_NAME] = this.lastName;
	updateValuesMap[DbConstants.SSN] = this.ssn;
	updateValuesMap[DbConstants.STREET] = this.address.getStreet();
	updateValuesMap[DbConstants.CITY] = this.address.getCity();
	updateValuesMap[DbConstants.STATE_ID] = this.address.getState().getId();
	updateValuesMap[DbConstants.ZIP_CODE] = this.address.getZIP();
	updateValuesMap[DbConstants.MEMBERSHIP_ID] = utility.generateMembershipId();
    return updateValuesMap;
}

Person.prototype.validateUpdateInfo = function() {
	var validator = new Validator();
	validator.validateEmail(this.userLogin.getEmail(), 'Email');
	validator.validateText(this.firstName, 'First Name', 45);
	validator.validateText(this.lastName, 'Last Name', 45);
	
	validator.validateBlank(this.userLogin.getPassword(), 'Password');
	validator.validateSSN(this.ssn);
	
	validator.validateBlank(this.address.getStreet(), 'Street');
	validator.validateText(this.address.getCity(), 'City');
	validator.validateState(this.address.getState(), 'State');
	validator.validateZIP(this.address.getZIP(), 'ZIP');
	return validator.getErrorList();
}

module.exports = Person;