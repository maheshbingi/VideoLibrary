var utility = require("./utility");
var Constants = require(utility.getConstantsPath());
var ERROR = false;

var Validator = function () {
	this.errorList = {};
	this.errorList[Constants.ERRORS] = [];
	this.errorList[Constants.STATUS] = true;
}

Validator.prototype.validateText = function(value, fieldName, requiredLength) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if(!this.validateChar(value, fieldName)) {
		return false;
	}
	if(!this.validateLength(value, fieldName, requiredLength)) {
		return false;
	}
	return true;
}

Validator.prototype.validateNumber = function(value, fieldName, requiredLength) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if(!this.validateNum(value, fieldName)) {
		return false;
	}
	if(!this.validateLength(value, fieldName, requiredLength)) {
		return false;
	}
	return true;
}

Validator.prototype.validateChar = function(value, fieldName) {
	var isOnlyCharacters = /^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(value);
	if(!isOnlyCharacters) {
		this.errorList[Constants.ERRORS].push("Numbers and special characters like '!,@,$,%,^,&,*' are not allowed in " + fieldName);
		this.errorList[Constants.STATUS] = ERROR;
	}
	return isOnlyCharacters;
}

Validator.prototype.validateNum = function(value, fieldName) {
	var isOnlyNumbers = /^[0-9]+$/.test(value);
	if(!isOnlyNumbers) {
		this.errorList[Constants.ERRORS].push("Characters and special characters '!,@,$,%,^,&,*' are not allowed in " + fieldName);
		this.errorList[Constants.STATUS] = ERROR;
	}
	return isOnlyNumbers;
}

Validator.prototype.validateBlank = function(value, fieldName) {
	if (value == null || value == Constants.ERROR_ID || value.trim() == "") {
		this.errorList[Constants.ERRORS].push("Please enter " + fieldName);
		this.errorList[Constants.STATUS] = ERROR;
		return false;
    }
	return true;
}

Validator.prototype.validateMemberShip = function(value, fieldName) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if(!this.validateNum(value, fieldName)) {
		return false;
	}
	
	var Membership = require(utility.getModelsPath() + '/membership');
	var DbConstants = require(utility.getDbConstantsPath());
	var memberShipTypes = Membership.getCachedMembershipTypes();

	var isValidMembership = false;
	for(var i = 0; i < memberShipTypes.length; i++) {
		var membershipObject = memberShipTypes[i];
		if (membershipObject[DbConstants.ID] == value) {
			isValidMembership = true;
			break;
		}
	}
	if(!isValidMembership) {
		this.errorList[Constants.ERRORS].push("Incorrect " + fieldName);
		this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	return true;
}

Validator.prototype.validateState = function(value, fieldName) {
	if(!this.validateBlank(value.getState(), fieldName)) {
		return false;
	}
	if (value.getId() == Constants.ERROR_ID) {
		this.errorList[Constants.ERRORS].push("Not a valid state");
		this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	return true;
}

Validator.prototype.validatePrice = function(value, fieldName) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if (isNaN(parseFloat(value))) {
    	this.errorList[Constants.ERRORS].push("Not a valid " + fieldName);
    	this.errorList[Constants.STATUS] = ERROR;
        return false;
    }
	return true;
}

Validator.prototype.validateZIP = function(value, fieldName) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value);
	if (!isValidZip) {
		this.errorList[Constants.ERRORS].push("Not a valid ZIP code");
		this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	return true;
}

Validator.prototype.validateSSN = function(value) {
	if(!this.validateBlank(value, 'SSN')) {
		return false;
	}
	var isValidSSN = /^\d{3}-\d{2}-\d{4}$/.test(value);
	if (!isValidSSN) {
		this.errorList[Constants.ERRORS].push("Not a valid SSN");
		this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	return true;
}

Validator.prototype.validateEmail = function(value, fieldName, requiredLength) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	
	var atpos = value.indexOf("@");
	var dotpos = value.lastIndexOf(".");
	if (atpos < 1 || dotpos < atpos+2 || dotpos + 2 >= value.length) {
		this.errorList[Constants.ERRORS].push("Not a valid e-mail address");
		this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	
	if(!this.validateLength(value, fieldName, requiredLength)) {
		return false;
	}
	
	return true;
}

Validator.prototype.validateLength = function(value, fieldName, requiredLength) {
	if(value.length > requiredLength) {
		this.errorList[Constants.ERRORS].push(fieldName + " should not contain more than " + requiredLength + " characters");
		this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	return true;
}

Validator.prototype.validateCategories = function(categories, fieldName) {
	if(categories == null) {
		this.errorList[Constants.ERRORS].push("Not a valid " + fieldName);
    	this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	
	for(var i=0; i < categories.length; i++) {
		console.log("Categories Validator --> Length:"+ categories.length + " ID:"+ categories);
		
		if(categories.length == 1)
		{
			if(categories == Constants.ERROR_ID)
			{
				this.errorList[Constants.ERRORS].push("Not a valid " + fieldName);
				this.errorList[Constants.STATUS] = ERROR;
				return false;
			}	
		}
		else if(categories[i].getId() == Constants.ERROR_ID) {
			this.errorList[Constants.ERRORS].push("Not a valid " + fieldName);
			this.errorList[Constants.STATUS] = ERROR;
			return false;
		}
	}
	return true;
}

Validator.prototype.getErrorList = function() {
	return this.errorList;
}
module.exports = Validator;