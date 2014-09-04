var utility = require("../utility");
var Movie = require(utility.getModelsPath() + '/movie');
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var DbConstants = require(utility.getDbConstantsPath());
var db = require(utility.getDbHandlerPath());
var RedisCache = require(utility.getRedisCachePath());



var Category = function (id) {
	
	this.id = (id != null ) ? id : Constants.ERROR_ID;
	console.log("in constructure :"+this.id);
	this.setId();
	
}

/**
 * Creates Category object from http request object
 * @param req
 */
Category.prototype.createFromRequest = function(req) {
	this.id = req.param(Constants.CATEGORY_ID,  null);
	this.setId();
	//this.name = req.param(Constants.CATEGORY_NAME,null);
}

//Id
Category.prototype.setId = function() {

	var RedisCache = require(utility.getRedisCachePath());
	console.log("in setID call " +this.id);
	
	//Category.movieCategories
	
	for(var i = 0; i < Category.movieCategories.length; i++) {
		var categoryObject = Category.movieCategories[i];
		console.log("Current Category ID::"+this.id);
		console.log("categoryObject ID::"+categoryObject[DbConstants.ID]);
		
		if (categoryObject[DbConstants.ID] == this.id) {
			this.id = categoryObject[DbConstants.ID];
			console.log("ID set done:::" + this.id);
			return;
		}
	}
	this.id = Constants.ERROR_ID;
	console.log("Final ID ::" + this.id);
	/*
	RedisCache.getCachedCategories(function(err,cachedMovieCategories) {
		if(!err)
		{
			for(var i = 0; i < cachedMovieCategories.length; i++) {
			
				var categoryObject = cachedMovieCategories[i];
				console.log(" current Category::"+this.id);
				
				if (categoryObject[DbConstants.ID] == this.id) {
					this.id = categoryObject[DbConstants.ID];
					console.log("ID set done:::" + this.id);
					return;
				}
			}
		}
		this.id = Constants.ERROR_ID;
	});*/
}

Category.prototype.getId = function() {
    return this.id;
}

//Name
Category.prototype.setName = function(name) {
	this.name = name;
}

Category.prototype.getName = function() {
    return this.name;
}

Category.prototype.validateAll = function() {
	var validator = new Validator();
	validator.validateBlank(this.name, 'Category Name');
	return validator.getErrorList();
}

Category.prototype.toJSON = function() {
	var category = {};
	category[Constants.CATEGORY_ID] = this.id;
	category[Constants.CATEGORY_NAME] = this.name;
	return category;
}

// List all categories query
Category.getAllCategoriesQuery = function() {
	// select * from category
	return "SELECT * FROM " + DbConstants.CATEGORY_TABLE;
}

Category.getCategoryQuery = function(categoryName) {
	// select * from category
	return "SELECT ID FROM " + DbConstants.CATEGORY_TABLE + " WHERE NAME='"+categoryName+"'";
}


Category.movieCategories = null;

Category.getCachedMovies = function() {
	return Category.movieCategories;
};

Category.setCachedMovies = function(movieCategories) {
	console.log("Setting movieCategories");
	Category.movieCategories = movieCategories;
};


Category.getCategoriesOfMovieQuery = function(movieID) {
	console.log("getCategoriesOfMovieQuery");
	//select name from category c,movie_categories mc where movie_id=5011 AND (c.id = mc.category_id)
	
	var getCategoriesOfMovieDBQuery = "SELECT name FROM CATEGORY c,MOVIE_CATEGORIES mc WHERE movie_id="+movieID+" AND ((c.id = mc.category_id))";
	return getCategoriesOfMovieDBQuery;
};



/*
Category.getCategoryIDFromCategoryName = function(cachedMovieCategories,userMovieCategories,callback) {
	
	var movieCategoryIDs=[];
	//movieCategoryIDs["id"]=[];
	
	console.log(JSON.stringify(cachedMovieCategories));
	console.log(JSON.stringify(userMovieCategories));
	
	for(var i=0; i<userMovieCategories.length;i++)
	{
		console.log("Length userMovies:"+ userMovieCategories.length);
		for(var j=0; j<cachedMovieCategories.length; j++)
		{
			if(cachedMovieCategories[j].name === userMovieCategories[i])
			{
				console.log("Inside loop");
				console.log(cachedMovieCategories[j]);
				movieCategoryIDs.push(cachedMovieCategories[j]);
			}
		}	
	}
	console.log(JSON.stringify(movieCategoryIDs));
	callback(movieCategoryIDs);	
}; 
*/

module.exports = Category;