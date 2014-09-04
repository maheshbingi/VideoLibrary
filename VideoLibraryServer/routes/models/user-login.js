var utility = require("../utility");
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var DbConstants = require(utility.getDbConstantsPath());

/**
 * Constructs user login object
 */
var UserLogin = function (id, email, password) {
	this.id = (id != null ) ? id : Constants.ERROR_ID;
	this.email = email;
	this.password = password;
}

/**
 * Constructs user login object from http request
 * @param req Http request
 */
UserLogin.prototype.createFromRequest = function(req) {
	this.id = req.param(Constants.USER_LOGIN_ID, Constants.ERROR_ID);
	this.email = req.param(Constants.EMAIL, null);
	this.password = req.param(Constants.PASSWORD, null);
}

//Id
UserLogin.prototype.setId = function(id) {
	this.id = id;
}

UserLogin.prototype.getId = function() {
    return this.id;
}

/**
 * Holds email id
 * @param email
 */
UserLogin.prototype.setEmail = function(email) {
	this.email = email;
}

/**
 * @returns Email id
 */
UserLogin.prototype.getEmail = function() {
    return this.email;
}

/**
 * Holds password
 * @param password
 */
UserLogin.prototype.setPassword = function(password) {
	this.password = password;
}

/**
 * @returns Password
 */
UserLogin.prototype.getPassword = function() {
    return this.password;
}

/**
 * @returns Sql query which can be used get id (pk of user login table) from email
 */
UserLogin.prototype.getUserLoginIdQuery = function() {
    return "SELECT " + DbConstants.ID + " FROM " + DbConstants.USER_LOGIN_TABLE + " WHERE " + DbConstants.EMAIL + " = " + "'" + this.email + "'";
}

/**
 * Constructs query to delete (deactivate) customer
 * @returns 
 */
UserLogin.prototype.getDisablePersonQuery = function() {
	return 'UPDATE ' + DbConstants.USER_LOGIN_TABLE +
	' SET ' +  DbConstants.IS_DISABLED + " = " + 1 +
	' WHERE ' + DbConstants.ID + " = " + this.id;
}

/**
 * Constructs query to mark customer status active
 * @returns
 */
UserLogin.prototype.getEnablePersonQuery = function() {
	return 'UPDATE ' + DbConstants.USER_LOGIN_TABLE +
	' SET ' +  DbConstants.IS_DISABLED + " = " + 0 +
	' WHERE ' + DbConstants.ID + " = " + this.id;
}

/**
 * @returns Sign in query to validate user
 */
UserLogin.prototype.getSignInQuery = function() {
	return 'SELECT ' + DbConstants.EMAIL + ", " + DbConstants.IS_DISABLED + " FROM " + DbConstants.USER_LOGIN_TABLE +
	' WHERE ' +
		DbConstants.EMAIL + " = " + "'" + this.email + "'" +
	' AND ' +
		DbConstants.PASSWORD + " = " + "'" + this.password + "'" ;
}

/**
 * @returns Map of db column and values
 */
UserLogin.prototype.getValuesMap = function() {
	var insertValuesMap = {};
	insertValuesMap[DbConstants.EMAIL] = this.email;
	insertValuesMap[DbConstants.PASSWORD] = this.password;
    return insertValuesMap;
}

/**
 * @returns Sql query to update password
 */
UserLogin.prototype.getUpdateUserLoginQuery = function() {
	return 'UPDATE ' + DbConstants.USER_LOGIN_TABLE + ' SET ? WHERE ' + DbConstants.ID + " = " + this.getId();
}

/**
 * @returns Sql query to update sign in information
 */
UserLogin.prototype.getUpdateUserLoginByEmailQuery = function() {
	return 'UPDATE ' + DbConstants.USER_LOGIN_TABLE + ' SET ? WHERE ' +
		DbConstants.EMAIL + " = " + "'" + this.getEmail() + "'";
}

/**
 * @returns Map of db column and password value which is to be updated
 */
UserLogin.prototype.getUpdateUserLoginValuesMap = function() {
	var insertValuesMap = {};
	if(this.getEmail() != null) {
		insertValuesMap[DbConstants.EMAIL] = this.getEmail();
	}
	if(this.password != null) {
		insertValuesMap[DbConstants.PASSWORD] = this.password;
	}
    return insertValuesMap;
}

/**
 * @returns Validates attributes of user login object
 */
UserLogin.prototype.validateAll = function() {
	var validator = new Validator();
	validator.validateEmail(this.email, 'Email');
	validator.validateBlank(this.password, 'Password');
	return validator.getErrorList();
}

module.exports = UserLogin;
