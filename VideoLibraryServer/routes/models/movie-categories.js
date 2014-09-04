var utility = require("../utility");
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var Movie = require(utility.getModelsPath() + '/movie');
var Category = require(utility.getModelsPath() + '/category');
var DbConstants = require(utility.getDbConstantsPath());


var MovieCategory = function (movieId,categoryId) {
	this.movie_id = movieId;
	this.category_id = categoryId;
}

/**
 * Creates MovieCategory object from http request object
 * @param req
 */
MovieCategory.prototype.createFromRequest = function(req) {
	this.movie = new Movie();
	this.category = new Category();
	this.movie.createFromRequest(req);
	this.category.createFromRequest(req);
}

//Movie
MovieCategory.prototype.setMovieID = function(movieId) {
	this.movie_id = movieId;
}

MovieCategory.prototype.getMovie = function() {
    return this.movie_id;
}

//Category
MovieCategory.prototype.setCategoryID = function(categoryId) {
	this.category_id = categoryId;
}

MovieCategory.prototype.getCategory = function() {
    return this.category_id;
}

MovieCategory.getCategoriesFromMovieIDQuery = function(movieID)
{
	//	select name from category c, movie_categories mc where movie_id=movieID and c.id=mc.category_id
	
	var dbQuery = "select name from "+DbConstants.CATEGORY_TABLE+" c,"+DbConstants.MOVIE_CATEGORIES+" mc where "+DbConstants.MOVIE_ID+"=" + movieID +
	" AND (c."+DbConstants.ID+" = " + "mc."+DbConstants.CATEGORY_ID + ")";
	
	return dbQuery;
}


//Insert map
MovieCategory.prototype.getValuesMap = function() {
	var insertValuesMap = {};
	insertValuesMap[DbConstants.MOVIE_ID] = this.movie_id;
	insertValuesMap[DbConstants.CATEGORY_ID] = this.category_id;
	return insertValuesMap;
}


module.exports = MovieCategory;