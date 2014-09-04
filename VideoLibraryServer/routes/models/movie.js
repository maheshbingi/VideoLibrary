var utility = require("../utility");
var Movie = require(utility.getModelsPath() + '/movie');
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var DbConstants = require(utility.getDbConstantsPath());
var Category = require(utility.getModelsPath() + '/category');
var RedisCache = require(utility.getRedisCachePath());

var Movie = function (id, name, banner, releaseDate, rentAmount, availableCopies, userCategories) {
    this.id = (id != null ) ? id : Constants.ERROR_ID;
    this.name = name;
    this.banner = banner;
    this.releaseDate = releaseDate;
    this.rentAmount = rentAmount;
    this.availableCopies = availableCopies;
    this.categories = [];

    if(userCategories != null)
    {   
        for(var i=0; i< userCategories.length; i++)
        {   
            console.log("in Movie constructor--->" + userCategories[i]);
            this.categories[i] = new Category(userCategories[i]);
        }
    }
}

/**
 * Creates Movie object from http request object
 * @param req
 */
Movie.prototype.createFromRequest = function(req) {
    this.id = req.param(Constants.MOVIE_ID, null);
    this.name = req.param(Constants.MOVIE_NAME, null);
    this.banner = req.param(Constants.BANNER, null);
    this.releaseDate = req.param(Constants.RELEASE_DATE, null);
    this.rentAmount = req.param(Constants.RENT_AMOUNT, null);
    this.availableCopies = req.param(Constants.AVAILABLE_COPIES, null);
    this.categories = req.param(Constants.CATEGORIES, null);

    if(this.categories != null)
    {
    	console.log("Categories Length:-"+this.categories.length);
    	console.log("Categories "+JSON.stringify(this.categories));
    	
    	if(this.categories.length == 1)
    	{
    		this.categories[0] = new Category(this.categories);
    		console.log("this.categories[i] for Lenght=1 ::-"+JSON.stringify(this.categories[0]));
    	}	
    	else
    	{
    		for(var i=0; i< this.categories.length; i++)
            {   
                this.categories[i] = new Category(this.categories[i]);
            }
    	}	
    }
}

// Name
Movie.prototype.setName = function(name) {
    this.name = name;
}

Movie.prototype.getName = function() {
    return this.name;
}

//Id
Movie.prototype.setId = function(id) {
    this.id = id;
}

Movie.prototype.getId = function() {
    return this.id;
}

// Banner
Movie.prototype.setBanner = function(banner) {
    this.banner = banner;
}

Movie.prototype.getBanner = function() {
    return this.banner;
}

// Release date
Movie.prototype.setReleaseDate = function(releaseDate) {
    this.releaseDate = releaseDate;
}

Movie.prototype.getReleaseDate = function() {
    return this.releaseDate;
}

// Rent amount
Movie.prototype.setRentAmount = function(rentAmount) {
    this.rentAmount = rentAmount;
}

Movie.prototype.getRentAmount = function() {
    return this.rentAmount;
}

// Available copies
Movie.prototype.setAvailableCopies = function(availableCopies) {
    this.availableCopies = availableCopies;
}

Movie.prototype.getAvailableCopies = function() {
    return this.availableCopies;
}

// Categories
Movie.prototype.setCategories = function(categories) {
    this.categories = categories;
}

Movie.prototype.getCategories = function() {
    return this.categories;
}

Movie.prototype.toJSON = function() {   
    var movies = {};
    movies[Constants.MOVIE_ID] = this.id;
    movies[Constants.NAME] = this.name;
    movies[Constants.BANNER] = this.banner;
    movies[Constants.RELEASE_DATE] = this.releaseDate;
    movies[Constants.RENT_AMOUNT] = this.rentAmount;
    movies[Constants.AVAILABLE_COPIES] = this.availableCopies;
    
    return movies;
}

//Insert map
Movie.prototype.getValuesMap = function() {
    var insertValuesMap = {};
    insertValuesMap[DbConstants.NAME] = this.name;
    insertValuesMap[DbConstants.BANNER] = this.banner;
    insertValuesMap[DbConstants.RELEASE_DATE] = this.releaseDate;
    insertValuesMap[DbConstants.RENT_AMOUNT] = this.rentAmount;
    insertValuesMap[DbConstants.AVAILABLE_COPIES] = this.availableCopies;
    return insertValuesMap;
}

// Decrement available copies query
Movie.prototype.decrementAvailableCopiesQuery = function() {
    return "UPDATE " + DbConstants.MOVIES_TABLE  + " SET " + DbConstants.AVAILABLE_COPIES + " = " +  '(' +  DbConstants.AVAILABLE_COPIES + ' - ' + 1 + ')' +
    " WHERE " + DbConstants.ID + "=" + this.getId();
}

// Increment available copies query
Movie.prototype.incrementAvailableCopiesQuery = function() {
    return "UPDATE " + DbConstants.MOVIES_TABLE  + " SET " + DbConstants.AVAILABLE_COPIES + " = " +  '(' +  DbConstants.AVAILABLE_COPIES + ' + ' + 1 + ')' +
    " WHERE " + DbConstants.ID + "=" + this.getId();
}

Movie.prototype.isMovieAvailableQuery = function() {
    return "SELECT " + DbConstants.AVAILABLE_COPIES + " FROM " + DbConstants.MOVIES_TABLE +
    " WHERE " + DbConstants.ID + "=" + this.getId();
}

Movie.prototype.validateAll = function() {
    var validator = new Validator();
    
    validator.validateBlank(this.name, 'Movie Name');
    validator.validateBlank(this.banner, 'Banner');
    validator.validateBlank(this.releaseDate, 'Release Date');
    validator.validatePrice(this.rentAmount, 'Rent Amount');
    validator.validateNumber(this.availableCopies, 'Available Copies');
    validator.validateCategories(this.categories, 'Category/ies');
    
    return validator.getErrorList();
}

Movie.prototype.validateUpdate = function() {
    var validator = new Validator();
    validator.validateBlank(this.id, 'Movie Id');
    validator.validateBlank(this.name, 'Movie Name');
    validator.validateBlank(this.banner, 'Banner');
    validator.validateBlank(this.releaseDate, 'Release Date');
    validator.validatePrice(this.rentAmount, 'Rent Amount');
    validator.validateNumber(this.availableCopies, 'Available Copies');
    validator.validateCategories(this.categories, 'Categories');
    
    console.log(validator.getErrorList());
    return validator.getErrorList();
}

Movie.prototype.validateId = function() {
    var validator = new Validator();
    
    validator.validateBlank(this.id, 'Movie Id');
    
    console.log(validator.getErrorList());
    return validator.getErrorList();
}

// Select Movies Query
Movie.prototype.getMoviesSelectQuery = function() {
    return "SELECT * FROM " + DbConstants.MOVIES_TABLE;
}

// Update query
Movie.prototype.getUpdateMovieQuery = function() {
    return "UPDATE " + DbConstants.MOVIES_TABLE + " SET ? WHERE " + DbConstants.ID + " = " + "(" + this.getId() + ")";
}

// Delete query
Movie.prototype.getDeleteMovieQuery = function() {
    console.log("DELETE FROM " + DbConstants.MOVIES_TABLE + " WHERE " + DbConstants.ID + " = " + "(" + this.getId() + ")");
    return "DELETE FROM " + DbConstants.MOVIES_TABLE + " WHERE " + DbConstants.ID + " = " + "(" + this.getId() + ")";
}

Movie.getAllMoviesSelectQuery = function() {
	return "SELECT * FROM " + DbConstants.MOVIES_TABLE;
};

Movie.getAllCategoriesSelectQuery = function() {
	return "SELECT * FROM " + DbConstants.CATEGORY_TABLE;
};

module.exports = Movie;