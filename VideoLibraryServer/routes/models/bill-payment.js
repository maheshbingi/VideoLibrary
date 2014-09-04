var utility = require("../utility");
var Person = require(utility.getModelsPath() + '/person');
var db = require(utility.getDbHandlerPath());
var DbConstants = require(utility.getDbConstantsPath());
var Constants = require(utility.getConstantsPath());
var Validator = require(utility.getValidator());

var BillPayment = function (personId, amount) {
	this.person = new Person(personId);
	this.amount = amount;
}

/**
 * Creates BillPayment object from http request object
 * @param req
 */
BillPayment.prototype.createFromRequest = function(req) {
	this.person = new Person();
	this.person.createFromRequest(req);
	this.amount = req.param(Constants.BILL_AMOUNT, null);
}

// Customer
BillPayment.prototype.setPerson = function(person) {
	this.person = person;
}

BillPayment.prototype.getPerson = function() {
    return this.person;
}

// Amount
BillPayment.prototype.setAmount = function(amount) {
	this.amount = amount;
}

BillPayment.prototype.getAmount = function() {
    return this.amount;
}

BillPayment.prototype.getValuesMap  = function() {
	var insertValuesMap = {};
	insertValuesMap[DbConstants.PERSON_ID] = parseInt(this.getPerson().getId());
	insertValuesMap[DbConstants.AMOUNT] = parseFloat(this.getAmount());
	insertValuesMap[DbConstants.PAYMENT_DATE] = utility.getCurrentDate();
    return insertValuesMap;
}

BillPayment.prototype.validateAll = function() {
	var validator = new Validator();
	validator.validateNumber(this.getPerson().getId(), 'Customer ID');
	validator.validatePrice(this.getAmount(), 'Amount');
	return validator.getErrorList();
}

module.exports = BillPayment;