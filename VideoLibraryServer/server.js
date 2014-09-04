var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

var utility = require("./routes/utility");
var db = require(utility.getDbHandlerPath());
var DbConstants = require(utility.getDbConstantsPath());

var customerWebServices = require(utility.getWebServicesPath() + "/customer");
var movieWebServices = require(utility.getWebServicesPath() + "/movie");
var categoryWebServices = require(utility.getWebServicesPath() + "/category");
var customerMovieWebServices = require(utility.getWebServicesPath() + "/customer-movie");
var Membership = require(utility.getModelsPath() + '/membership');
var Movie = require(utility.getModelsPath() + '/movie');
var RedisCache = require(utility.getRedisCachePath());
var Category = require(utility.getModelsPath() + '/category');
var MovieCategory = require(utility.getModelsPath() + '/movie-categories');
var State = require(utility.getModelsPath() + '/state');
var Redis = require(utility.getRedisCachePath());
var DbCreator = require(utility.getDbCreatorPath());

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

// Customer web services
app.post('/getMemberInfo', customerWebServices.getMemberInfo);
app.post('/signUp', customerWebServices.signUp);
app.post('/deleteMember', customerWebServices.deleteMember);
app.post('/enableMember', customerWebServices.enableMember);
app.post('/listAllPremiumMembers', customerWebServices.listAllPremiumMembers);
app.post('/listAllSimpleCustomers', customerWebServices.listAllSimpleCustomers);
app.post('/listAllPersons', customerWebServices.listAllPersons);
app.post('/editPersonInfo', customerWebServices.editPersonInfo);
app.post('/searchPerson', customerWebServices.searchPerson);
app.post('/signIn', customerWebServices.signIn);
app.post('/getStateAndMembershipDetails', customerWebServices.getStateAndMembershipDetails);
app.post('/payBill', customerWebServices.payBill);

// Movie web services
app.post('/createMovie', movieWebServices.createMovie);
app.post('/editMovie', movieWebServices.editMovie);
app.post('/deleteMovie', movieWebServices.deleteMovie);
app.post('/searchMovie', movieWebServices.searchMovie);
app.post('/getAllMovies', movieWebServices.getAllMovies);
app.get('/getAllMovies', movieWebServices.getAllMovies);
app.post('/getAllCategories', categoryWebServices.getAllCategories);
app.get('/getAllCategories', categoryWebServices.getAllCategories);
app.post('/getCategoriesOfMovie', categoryWebServices.getCategoriesOfMovie);
app.get('/getCategoriesOfMovie', categoryWebServices.getCategoriesOfMovie);


//Customer-Movie web services
app.post('/issueMovie', customerMovieWebServices.issueMovie);
app.post('/submitMovie', customerMovieWebServices.submitMovie);
app.post('/listMoviesIssuedToPerson', customerMovieWebServices.listMoviesIssuedToPerson);
app.post('/listPersonsIssuedMovie', customerMovieWebServices.listPersonsIssuedMovie);
app.post('/generateBillForCustomer', customerMovieWebServices.generateBillForCustomer);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    console.log("========== Initialising db ============");
    DbCreator.initializeDb(onDbInitialised);
});

function onDbInitialised() {
	console.log("========== Db initialised ============");
	db.execSQL(State.getSelectQuery(), onStatesDetailsFetched);
    db.execSQL(Membership.getSelectQuery(), onMembershipDetailsFetched);
    
	db.execSQL(Category.getAllCategoriesQuery(), function(err,movieCategories) {
        Category.setCachedMovies(movieCategories);
        RedisCache.cacheCategories(movieCategories);
    });
}

/**
 * Caching states in Redis
 * @param err
 * @param result
 */
function onStatesDetailsFetched(err, result) {
    if(!err) {
    	State.cacheStates(result);
    	RedisCache.cacheStates(result);
    } else {
        console.log("Error while fetching states" + err);
    }
}

/**
 * Caching membership in Redis
 * @param err
 * @param result
 */
function onMembershipDetailsFetched(err, result) {
    if(!err) {
    	Membership.cacheMembershipTypes(result);
    	RedisCache.cacheMembershipTypes(result);
    } else {
        console.log("Error while fetching membership types " + err);
    }
}