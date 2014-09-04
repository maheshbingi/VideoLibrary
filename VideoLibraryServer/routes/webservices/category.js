var utility = require("../utility");
var Movie = require(utility.getModelsPath() + '/movie');
var Category = require(utility.getModelsPath() + '/category');
var MovieCategory = require(utility.getModelsPath() + '/movie-categories');
var db = require(utility.getDbHandlerPath());
var DbConstants = require(utility.getDbConstantsPath());
var Constants = require(utility.getConstantsPath());
var RedisCache = require(utility.getRedisCachePath());


exports.getAllCategories = function(req, res) {
	m = new Movie();
	var data = {};
	
	RedisCache.getCachedCategories(function(err,movieCategories){
		
		data[Constants.CATEGORIES]= movieCategories;
		console.log("All MovieCategories returned");
		console.log(JSON.stringify(data));
		utility.writeSuccessJSON(res, data ,"All MovieCategories returned");
	});
};

exports.getCategoriesOfMovie = function(req, res) {
	m = new Movie();
	m.createFromRequest(req);

	// Validate all the details
	var errors = m.validateId();

	// If details are invalid then return error message
	if(!errors.status) {
		utility.writeCustomFailureJSON(res, errors);
	} 
	else 
	{
		var data = {};
		
		db.execSQL(MovieCategory.getCategoriesFromMovieIDQuery(m.getId()), function(err,result) {
			
			data[Constants.CATEGORIES]= result;
			
			console.log("All Categories of given movie returned");
			console.log(JSON.stringify(data));
			
			utility.writeSuccessJSON(res, data ,"All Categories of given movie returned");
		});
	}
};


