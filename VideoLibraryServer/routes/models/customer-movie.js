var utility = require("../utility");
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var Person = require(utility.getModelsPath() + '/person');
var Movie = require(utility.getModelsPath() + '/movie');
var DbConstants = require(utility.getDbConstantsPath());

var CustomerMovie = function (issuedMovieId, customerId, movieId) {
	this.issuedMovieId = (issuedMovieId != null ) ? issuedMovieId : Constants.ERROR_ID;
	this.customer = new Person(customerId);
	this.movie = new Movie(movieId);
}

/**
 * Creates CustomerMovie object from http request object
 * @param req
 */
CustomerMovie.prototype.createFromRequest = function(req) {
	this.issuedMovieId = req.param(Constants.ISSUED_MOVIE_ID, Constants.ERROR_ID);
	this.customer = new Person();
	this.movie = new Movie();
	this.customer.createFromRequest(req);
	this.movie.createFromRequest(req);
}

// Id, primary key of issued_movies table
CustomerMovie.prototype.setIssuedMovieId = function(issuedMovieId) {
	this.issuedMovieId = issuedMovieId;
}

CustomerMovie.prototype.getIssuedMovieId = function() {
    return this.issuedMovieId;
}

// Customer
CustomerMovie.prototype.setCustomer = function(customer) {
	this.customer = customer;
}

CustomerMovie.prototype.getCustomer = function() {
    return this.customer;
}

// Movie
CustomerMovie.prototype.setMovie = function(movie) {
	this.movie = movie;
}

CustomerMovie.prototype.getMovie = function() {
    return this.movie;
}

CustomerMovie.prototype.getIssueMovieMap  = function() {
	var insertValuesMap = {};
	insertValuesMap[DbConstants.PERSON_ID] = parseInt(this.customer.getId());
	insertValuesMap[DbConstants.MOVIE_ID] = parseInt(this.movie.getId());
	insertValuesMap[DbConstants.ISSUED_DATE] = utility.getCurrentDate();
	console.log(insertValuesMap);
    return insertValuesMap;
}

// Submit movie query
CustomerMovie.prototype.getSubmitMovieQuery  = function() {
    return "UPDATE " + DbConstants.ISSUED_MOVIES + " SET ? WHERE " + 
    	DbConstants.ID + " = " + this.getIssuedMovieId();
}

// Update amount paid value map
CustomerMovie.prototype.getUpdateAmountPaidMap  = function() {
	var updateAmountPaidMap = {};
	updateAmountPaidMap[DbConstants.IS_PAID] = 1;
    return updateAmountPaidMap;
}

// Update amount paid query
CustomerMovie.prototype.getUpdateAmountPaidQuery  = function() {
    return "UPDATE " + DbConstants.ISSUED_MOVIES + " SET ? WHERE " + 
    	DbConstants.PERSON_ID + " = " + this.getCustomer().getId();
}

// Submitted movie id query
CustomerMovie.prototype.getIssuedMovieDetailsQuery  = function() {
    return "SELECT " + DbConstants.MOVIE_ID + ", " + DbConstants.SUBMITTED_DATE + " FROM " + DbConstants.ISSUED_MOVIES + " WHERE " + 
    	DbConstants.ID + " = " + this.getIssuedMovieId();
}

// To return count of movies issued to customer
CustomerMovie.prototype.getMoviesCountIssuedToCustomerQuery = function() {
    return "SELECT count(*) as " + DbConstants.ISSUED_MOVIES_COUNT + " FROM " + DbConstants.ISSUED_MOVIES +
    " WHERE " + DbConstants.PERSON_ID + "=" + this.getCustomer().getId() +
    " AND " + DbConstants.SUBMITTED_DATE + " IS NULL";
}

// Returns map of submitted date (i.e. current date)
CustomerMovie.prototype.getSubmitMovieMap  = function() {
	var submitMovieMap = {};
	submitMovieMap[DbConstants.SUBMITTED_DATE] = utility.getCurrentDate();
	return submitMovieMap;
}

// Get movies issued to person query
CustomerMovie.prototype.getMoviesIssuedToCustomerQuery = function() {
	var query = "SELECT " +
		"m." + DbConstants.ID + ", " +
		"im." + DbConstants.ID + " as " + Constants.ISSUED_MOVIE_ID + ", " +
		"m." + DbConstants.NAME + ", " +
		"m." + DbConstants.BANNER + ", " +
		"m." + DbConstants.RELEASE_DATE + ", " +
		"m." + DbConstants.RENT_AMOUNT + ", " +
		"im." + DbConstants.ISSUED_DATE +
		
	" FROM " + DbConstants.MOVIES_TABLE + " m, " + DbConstants.ISSUED_MOVIES + " im " +
    " WHERE " +
    	"im." + DbConstants.PERSON_ID + " = " + this.getCustomer().getId() + 
    " AND " +
    	"m." + DbConstants.ID + " = " + "im." + DbConstants.MOVIE_ID +
    " AND " + DbConstants.SUBMITTED_DATE + " IS NULL";
	
	return query;
}

//Get persons issued to particular movie query
CustomerMovie.prototype.getCustomersIssuedMovieQuery = function() {
	var query = "SELECT " +
		"p." + DbConstants.ID + ", " +
		"p." + DbConstants.MEMBERSHIP_ID + ", " + 
		"p." + DbConstants.FIRST_NAME + ", " +
		"p." + DbConstants.LAST_NAME + ", " +
		"p." + DbConstants.SSN + ", " +
		"m." + DbConstants.TYPE + ", " +
		"im." + DbConstants.ISSUED_DATE +
		
	" FROM " + DbConstants.PERSON_TABLE + " p, " + DbConstants.ISSUED_MOVIES + " im, " + DbConstants.MEMBERSHIP_TABLE + " m" +
	" WHERE " +
		"p." + DbConstants.MEMBERSHIP_TYPE_ID + " = " + "m." + DbConstants.ID +
	" AND " +
		"im." + DbConstants.PERSON_ID + " = " + "p." + DbConstants.ID +
	" AND "  +
		"im." + DbConstants.MOVIE_ID + " = " + this.getMovie().getId() +
	" AND " + DbConstants.SUBMITTED_DATE + " IS NULL";
	return query;
}


// Get simple customer generate bill query
CustomerMovie.prototype.getSimpleCustomersGenerateBillQuery = function() {
	var query = "SELECT " +
		"sum(m." + DbConstants.RENT_AMOUNT + ") as " + DbConstants.BILL +
	" FROM " + DbConstants.MOVIES_TABLE + " m, " + DbConstants.ISSUED_MOVIES + " im " +
	" WHERE " +
		"im." + DbConstants.PERSON_ID + " = " + this.getCustomer().getId() +
	" AND "  +
		"im." + DbConstants.MOVIE_ID + " = " + "m." + DbConstants.ID +
	" AND " + DbConstants.IS_PAID  + " = 0";
	
	return query;
}

//Get premium customer generate bill query
CustomerMovie.prototype.getPremiumMemberGenerateBillQuery = function() {
	var query = "SELECT " +
		"max(" + DbConstants.PAYMENT_DATE + ") as " + DbConstants.LATEST_PAYMENT_DATE +
	" FROM " + DbConstants.BILL_PAYMENT_TABLE +
	" WHERE " +
		DbConstants.PERSON_ID + " = " + this.getCustomer().getId();
	return query;
}


CustomerMovie.prototype.validateAll = function() {
	var validator = new Validator();
	validator.validateNumber(this.getCustomer().getId(), 'Customer ID');
	validator.validateNumber(this.getMovie().getId(), 'Movie ID');
	return validator.getErrorList();
}

CustomerMovie.prototype.validateId = function() {
	var validator = new Validator();
	validator.validateNumber(this.getIssuedMovieId(), 'Issued Movie ID');
	return validator.getErrorList();
}

CustomerMovie.prototype.validateCustomerId = function() {
	var validator = new Validator();
	validator.validateNumber(this.getCustomer().getId(), 'Customer ID');
	return validator.getErrorList();
}

CustomerMovie.prototype.validateMovieId = function() {
	var validator = new Validator();
	validator.validateNumber(this.getMovie().getId(), 'Movie ID');
	return validator.getErrorList();
}

// Validate email id
CustomerMovie.prototype.validateEmailId = function() {
	var validator = new Validator();
	validator.validateEmail(this.getCustomer().getUserLogin().getEmail(), 'Email Id');
	return validator.getErrorList();
}

module.exports = CustomerMovie;