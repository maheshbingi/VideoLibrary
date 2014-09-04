var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
app.use(express.cookieParser());
app.use(express.cookieSession({secret: '1234qwerasdfzxcv'}));

var utility = require("./routes/utility");
var WebserviceHelper = require(utility.getWebServiceHelperPath());
var sessionManager = require(utility.getSessionManager());

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.post('/SignUp.ejs', function(req, res) {res.render('SignUp', req.body);});
app.get('/SignIn.ejs', function(req, res) {res.render('SignIn', req.body);});
app.get('/Members.ejs', function(req, res) {res.render('Members', req.body);});
app.get('/Movies.ejs', function(req, res) {res.render('Movies', req.body);});
app.post('/Movies.ejs', function(req, res) {res.render('Movies', req.body);});
app.post('/CreateMovie.ejs', function(req, res) {res.render('CreateMovie', req.body);});
app.post('/UserAccount.ejs', function(req, res) {res.render('UserAccount', req.body);});

app.get('/viewUserInfo.ejs', function(req, res) {res.render('viewUserInfo', req.body);});
app.post('/viewUserInfo.ejs', function(req, res) {res.render('viewUserInfo', req.body);});
app.get('/editUserInfo.ejs', function(req, res) {res.render('editUserInfo', req.body);});
app.get('/generateBill.ejs', function(req, res) {res.render('generateBill', req.body);});

app.get('/EditMovie.ejs', function(req, res) {res.render('EditMovie', req.body);});
app.post('/EditMovie.ejs', function(req, res) {res.render('EditMovie', req.body);});

app.get('/issueMovies.ejs', function(req, res) {res.render('issueMovies', req.body);});

app.get('/submitMovies.ejs', function(req, res) {res.render('submitMovies', req.body);});

app.get('/NoLoginMovies.ejs', function(req, res) {res.render('NoLoginMovies', req.body);});

app.get('/Payment.ejs', function(req, res) {res.render('Payment', req.body);});
app.post('/Payment.ejs', function(req, res) {res.render('Payment', req.body);});

app.get('/moviesOfMembers.ejs', function(req, res) {res.render('moviesOfMembers', req.body);});
app.post('/moviesOfMembers.ejs', function(req, res) {res.render('moviesOfMembers', req.body);});

app.get('/viewMyMovie.ejs', function(req, res) {res.render('viewMyMovie', req.body);});
app.post('/viewMyMovie.ejs', function(req, res) {res.render('viewMyMovie', req.body);});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/signUp', WebserviceHelper.executeRequest);
app.post('/getStateAndMembershipDetails', WebserviceHelper.executeRequest);
app.post('/signIn', sessionManager.signIn);
app.post('/signOut', sessionManager.signOut);

app.post('/deleteMember',WebserviceHelper.executeRequest);
app.post('/enableMember',WebserviceHelper.executeRequest);
app.post('/deleteMovie',WebserviceHelper.executeRequest);

app.post('/getAllMovies', WebserviceHelper.executeRequest);
app.get('/getAllMovies', WebserviceHelper.executeRequest);
app.post('/getMemberInfo', WebserviceHelper.executeRequest);

app.post('/getAllCategories', WebserviceHelper.executeRequest);
app.get('/getAllCategories', WebserviceHelper.executeRequest);


// movies
app.post('/createMovie', WebserviceHelper.executeRequest);
app.post('/editMovie', WebserviceHelper.executeRequest);

app.post('/issueMovie',WebserviceHelper.executeRequest);
app.post('/submitMovie',WebserviceHelper.executeRequest);

app.post('/getAllMovies', WebserviceHelper.executeRequest);

app.get('/listAllPersons', WebserviceHelper.executeRequest);
app.get('/listAllPremiumMembers', WebserviceHelper.executeRequest);
app.post('/editPersonInfo', sessionManager.editPersonInfo);
app.get('/listAllSimpleCustomers', WebserviceHelper.executeRequest);
app.post('/generateBillForCustomer', WebserviceHelper.executeRequest);

app.post('/listMoviesIssuedToPerson', WebserviceHelper.executeRequest);
app.post('/listPersonsIssuedMovie', WebserviceHelper.executeRequest);


app.get('/payBill', WebserviceHelper.executeRequest);
app.post('/payBill', WebserviceHelper.executeRequest);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});