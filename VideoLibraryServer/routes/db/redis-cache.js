var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");
var utility = require("../utility");
var Constants = require(utility.getConstantsPath());
var DbConstants = require(utility.getDbConstantsPath());
var State = require(utility.getModelsPath() + '/state');
var db = require(utility.getDbHandlerPath());
var Movie = require(utility.getModelsPath() + '/movie');
var MovieCategory = require(utility.getModelsPath() + '/movie-categories');

var RedisCache = function () {
}

client.on("error", function (err) {
    console.log("Error connecting REDIS Cache Server " + err);
});


/**
 * Caching STATES into REDIS database
 */
RedisCache.cacheStates = function(usStates) {
	client.set(Constants.STATES, JSON.stringify(usStates));
};


/**
 * Getting cached STATES from REDIS database
 */
RedisCache.getCachedStates = function(callback) {
	client.get(Constants.STATES, function (err, reply){
		callback(err,JSON.parse(reply));
	});
}; 

/**
 * Caching MEMBERSHIP_TYPES into REDIS database
 */
RedisCache.cacheMembershipTypes = function(membershipTypes) {
	client.set(Constants.MEMBERSHIP_TYPES,JSON.stringify(membershipTypes));
};

/**
 * Getting cached MEMBERSHIP_TYPES from REDIS database
 */
RedisCache.getCachedMembershipTypes = function(callback) {
	client.get(Constants.MEMBERSHIP_TYPES, function (err, reply){
		callback(err,JSON.parse(reply));
	});
};

/**
 * Caching MOVIE_CATEGORIES into REDIS database
 */
RedisCache.cacheCategories = function(movieCategories) {
	client.set(Constants.CATEGORIES, JSON.stringify(movieCategories));
};

/**
 * Getting cached MOVIE_CATEGORIES from REDIS database
 */
RedisCache.getCachedCategories = function(callback) {
	client.get(Constants.CATEGORIES, function (err, movieCategories){
		callback(err,JSON.parse(movieCategories));
	});
}; 

/*
// Caching MOVIES with its CATEGORIES into REDIS database
RedisCache.cacheMoviesWithCategories = function(cachedMoviesWithCategories) {
	client.set(Constants.MOVIES_WITH_CATEGORIES, JSON.stringify(cachedMoviesWithCategories));
};

// Getting cached MOVIES with its CATEGORIES from REDIS database
RedisCache.getCachedMoviesWithCategories = function(callback) {
	client.get(Constants.MOVIES_WITH_CATEGORIES, function (err, moviesWithCategories){
		callback(err,JSON.parse(moviesWithCategories));
	});
};

RedisCache.cachedMovies = {};
//RedisCache.cachedMovies[Constants.MOVIES] = [];


RedisCache.cacheMovies = function(movies) {
	
	for(var i=0; i<movies.length; i++)
	{
		var currentMovie = movies[i];
		RedisCache.getCachedMovies().movies.push(movies[i]);
		
		
		
		//	var dbQuery = "select name from "+DbConstants.CATEGORY_TABLE+" c,"+DbConstants.MOVIE_CATEGORIES+" mc where "+DbConstants.MOVIE_ID+"=" + movies[i].id +
		//	" AND " + "c."+DbConstants.ID+" = " + "mc."+DbConstants.CATEGORY_ID;
		
		//select name from category c,movie_categories mc where movie_id=11 AND (c.id = mc.category_id)
		
		
		var getMovieCategoriesQuery = MovieCategory.getCategoriesFromMovieIDQuery(JSON.stringify(movies[i].id));
		
		db.execSQL(getMovieCategoriesQuery, function (err,currentMovieCategories) {

			var categoriesJSON = [];
			for(var j=0; j < currentMovieCategories.length ; j++)
			{
				categoriesJSON.push(currentMovieCategories[j].name);
			}
			
			RedisCache.incrementCachedMoviesCount();
				
			if(RedisCache.getCachedMoviesCount() == RedisCache.getCachedMovies().movies.length) {	
				RedisCache.cacheMoviesWithCategories(RedisCache.getCachedMovies());
			}
		});
		
	}
}; 


RedisCache.getCachedMovies = function() {
	return RedisCache.cachedMovies;
};

RedisCache.moviesCount = 0;

RedisCache.getCachedMoviesCount = function() {
	return RedisCache.moviesCount;
};

RedisCache.incrementCachedMoviesCount = function() {
	RedisCache.moviesCount++;
};
*/

module.exports = RedisCache;