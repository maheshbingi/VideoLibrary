var utility = require("./utility");
var WebserviceHelper = require(utility.getWebServiceHelperPath());
var res;

exports.index = function(req, res) {
	//console.log(req.session);
	// if(req.session != null && req.session.email != null)
	res.render('WelcomePage', { data : req.session});
	return;
	/*response = res;
	var data = { person_id : '',
			movie_id : '',
		email : 'amol@gmail.com',
		password : 'pass',
		ssn : '987-65-4320',
		membership_type_id : '2',
		street : '4 St',
		city : 'san jose',
		state : 'CA',
		zip : '95112'
	};
	WebserviceHelper.execute('/issueMovie', data, createPremiumMemberResponse);*/
};

function createPremiumMemberResponse(data, statusCode) {
	response.writeHeader(statusCode, {"Content-Type": "application/json"});  
	response.write(data);  
	response.end();
}