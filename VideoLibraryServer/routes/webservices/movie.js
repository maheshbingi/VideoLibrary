var utility = require("../utility");
var Movie = require(utility.getModelsPath() + '/movie');
var Category = require(utility.getModelsPath() + '/category');
var MovieCategory = require(utility.getModelsPath() + '/movie-categories');
var db = require(utility.getDbHandlerPath());
var DbConstants = require(utility.getDbConstantsPath());
var Constants = require(utility.getConstantsPath());
var RedisCache = require(utility.getRedisCachePath());


var Movies = function () {
}

exports.createMovie = function(req, res) {
	console.log("Inside create movie");
	console.log(req.body);
	response = res;
	m = new Movie();
	m.createFromRequest(req);

	// Validate all the details
	var errors = m.validateAll();

	// If details are invalid then return error message
	if(!errors.status) {
		utility.writeCustomFailureJSON(res, errors);
	} 
	else 
	{
		var insertValueMap = m.getValuesMap();
		userMovieCategories = m.getCategories();
		
		db.insert(DbConstants.MOVIES_TABLE, insertValueMap, function(err,result) {
			
			categoriesInsertedCount = 0;
			
			if(userMovieCategories.length == 1)
			{
				console.log("Inside userMovieCategories Length =1 -->"+(userMovieCategories));
				var movieCategory = new MovieCategory(result.insertId,(userMovieCategories));
				
				db.insert(DbConstants.MOVIE_CATEGORIES, movieCategory.getValuesMap(), function(err,result){
					categoriesInsertedCount++;
					if(categoriesInsertedCount == (userMovieCategories.length)) {
						utility.writeSuccessJSON(res, m.toJSON() ,"Movie inserted successfully");
					}
					
				});
			}
			else
			{
				for(var i=0; i< userMovieCategories.length; i++)
				{
					console.log(JSON.stringify(userMovieCategories));
					var movieCategory = new MovieCategory(result.insertId,userMovieCategories[i].id);
					db.insert(DbConstants.MOVIE_CATEGORIES, movieCategory.getValuesMap(), function(err,result){
						categoriesInsertedCount++;
						if(categoriesInsertedCount == (userMovieCategories.length - 1)) {
							utility.writeSuccessJSON(res, m.toJSON() ,"Movie inserted successfully");
						}
						
					});
				}
			}	
				
		});
	}
};


exports.editMovie = function(req, res) {
	console.log("Inside edit movie");
	response = res;
	m = new Movie();
	m.createFromRequest(req);

	// Validate all the details
	var errors = m.validateUpdate();

	// If details are invalid then return error message
	if(!errors.status) {
		utility.writeCustomFailureJSON(res, errors);
	} 
	else 
	{
		// delete Movie with categories from database
		db.execSQL(m.getDeleteMovieQuery(), function(err,result) {
			
			// update Movie with new values
			var insertValueMap = m.getValuesMap();
			var userMovieCategories = m.getCategories();
			
			db.insert(DbConstants.MOVIES_TABLE, insertValueMap, function(err,result) {
				
				categoriesInsertedCount = 0;
				
				console.log("userMovieCategories Length="+userMovieCategories.length);
				
				//if(userMovieCategories.length == 1)
				
				for(var i=0; i< userMovieCategories.length; i++)
				{
					var movieCategory = new MovieCategory(result.insertId,userMovieCategories[i].id);
					db.insert(DbConstants.MOVIE_CATEGORIES, movieCategory.getValuesMap(), function(err,result){
						categoriesInsertedCount++;
						if(categoriesInsertedCount == (userMovieCategories.length - 1)) {
							utility.writeSuccessJSON(res, m.toJSON() ,"Movie updated successfully");
						}
					});
				}	
			});
		});
	}
};


exports.deleteMovie = function(req, res) {
	console.log("Inside delete movie");
	
	response = res;
	m = new Movie();
	m.createFromRequest(req);

	// Validate all the details
	var errors = m.validateId();

	// If details are invalid then return error message
	if(!errors.status) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		// Delete Movie from database
		db.execSQL(m.getDeleteMovieQuery(), function(err,result) {
			utility.writeSuccessJSON(response, m.toJSON() ,"Movie deleted successfully");
		});
	}
};

exports.searchMovie = function(req, res) {
	console.log("Inside search movie");
};

/*
exports.getAllMovies = function(req, res) {
	m = new Movie();
	var data = {};
	
	db.execSQL(m.getMoviesSelectQuery(), function(err,result) {
		
		data[Constants.MOVIES]= result;
		
		console.log("Movies returned");
		console.log(JSON.stringify(data));
		
		utility.writeSuccessJSON(res, data ,"All movies returned");
	});
};
*/


/*
Movies.movies = {};
Movies.movies.movies = [];

Movies.getMovies = function() {
	return Movies.movies;
};

Movies.moviesCount = 0;

Movies.getMoviesCount = function() {
	return Movies.moviesCount;
};

Movies.incrementMoviesCount = function() {
	Movies.moviesCount++;
};


exports.getAllMovies = function(req, res) {
	m = new Movie();
	var data = {};
	
	db.execSQL(m.getMoviesSelectQuery(), function(err,movies) {
		
		for(var i=0; i<movies.length; i++)
		{
			var currentMovie = movies[i];
			Movies.getMovies().movies.push(movies[i]);
			console.log("Current Movie -->"+ JSON.stringify(movies[i]));
			//console.log(JSON.stringify(Movies.getMovies().movies));
			
			//select name from category c,movie_categories mc where movie_id=11 AND (c.id = mc.category_id)
			
			var getMovieCategoriesQuery = MovieCategory.getCategoriesFromMovieIDQuery(JSON.stringify(movies[i].id));
			
			db.execSQL(getMovieCategoriesQuery, function (err,currentMovieCategories) {
				
				console.log("CurrentMovieCategories");
				console.log(currentMovieCategories);
				var categoriesJSON = [];
				
				for(var j=0; j < currentMovieCategories.length ; j++)
				{
					categoriesJSON.push(currentMovieCategories[j].name);
				}
				
				Movies.getMovies().movies[Movies.getMoviesCount()][Constants.CATEGORIES] = categoriesJSON;
				Movies.incrementMoviesCount();
				
				if(Movies.getMoviesCount() == Movies.getMovies().movies.length) {	
					
					console.log(JSON.stringify(Movies.getMovies()));
					//Movie.cacheMoviesWithCategories(RedisCache.getCachedMovies());
					utility.writeSuccessJSON(res, Movies.getMovies() ,"All movies returned");
					Movies.movies = {};
					Movies.movies.movies = [];
					Movies.moviesCount = 0;
				}
			});
			
		}
		
		//	data[Constants.MOVIES]= movies;
		//	utility.writeSuccessJSON(res, data ,"All movies returned");
	});
};
*/


//Cached Movies
Movies.cachedMovies = {};
Movies.cachedMovies[Constants.MOVIES] = [];

Movies.getCachedMovies = function() {
    return Movies.cachedMovies;
};

Movies.moviesCount = 0;

Movies.getCachedMoviesCount = function() {
    return Movies.moviesCount;
};

Movies.incrementCachedMoviesCount = function() {
    Movies.moviesCount++;
};

exports.getAllMovies = function(req, res) {
    m = new Movie();
    var data = {};
    
    
    db.execSQL(Movie.getAllMoviesSelectQuery(), function (err,movies){
		
		db.execSQL(Movie.getAllCategoriesSelectQuery(), function (err,categories){
		
			for(var i=0; i<movies.length; i++)
			{
			    var currentMovie = movies[i];
			    Movies.getCachedMovies().movies.push(movies[i]);
			    
			    var dbQuery = "select name from "+DbConstants.CATEGORY_TABLE+" c,"+DbConstants.MOVIE_CATEGORIES+" mc where "+DbConstants.MOVIE_ID+"=" + movies[i].id +
			    " AND " + "c."+DbConstants.ID+" = " + "mc."+DbConstants.CATEGORY_ID;
			    
			    db.execSQL(dbQuery, function (err,currentMovieCategories) {
			        var categoriesJSON = [];
			        for(var j=0; j < currentMovieCategories.length ; j++)
			        {
			            categoriesJSON.push(currentMovieCategories[j].name);
			        }
			        
			        Movies.getCachedMovies().movies[Movies.getCachedMoviesCount()][Constants.CATEGORIES] = categoriesJSON;
			        Movies.incrementCachedMoviesCount();
			            
			        if(Movies.getCachedMoviesCount() == Movies.getCachedMovies().movies.length) {   
			            console.log(JSON.stringify(Movies.getCachedMovies()));
			        }
			        
			    });
			} 
			//RedisCache.cacheMovies(movies,categories);
		});
	});
    
    /*
    db.execSQL(m.getMoviesSelectQuery(), function(err,movies) {
    	getMoviesWithCategories(movies);
    	console.log("Function call done");
   });  */
};

function getMoviesWithCategories(movies){
	
	for(var i=0; i<movies.length; i++)
	{
	    var currentMovie = movies[i];
	    Movies.getCachedMovies().movies.push(movies[i]);
	    
	    var dbQuery = "select name from "+DbConstants.CATEGORY_TABLE+" c,"+DbConstants.MOVIE_CATEGORIES+" mc where "+DbConstants.MOVIE_ID+"=" + movies[i].id +
	    " AND " + "c."+DbConstants.ID+" = " + "mc."+DbConstants.CATEGORY_ID;
	    
	    db.execSQL(dbQuery, function (err,currentMovieCategories) {
	        var categoriesJSON = [];
	        for(var j=0; j < currentMovieCategories.length ; j++)
	        {
	            categoriesJSON.push(currentMovieCategories[j].name);
	        }
	        
	        Movies.getCachedMovies().movies[Movies.getCachedMoviesCount()][Constants.CATEGORIES] = categoriesJSON;
	        Movies.incrementCachedMoviesCount();
	            
	        if(Movies.getCachedMoviesCount() == Movies.getCachedMovies().movies.length) {   
	            console.log(JSON.stringify(Movies.getCachedMovies()));
	        }
	        
	    });
	} 
}

