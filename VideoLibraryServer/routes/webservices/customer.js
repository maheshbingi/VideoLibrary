var utility = require("../utility");
var Person = require(utility.getModelsPath() + '/person');
var UserLogin = require(utility.getModelsPath() + '/user-login');
var BillPayment = require(utility.getModelsPath() + '/bill-payment');
var CustomerMovie = require(utility.getModelsPath() + '/customer-movie');
var db = require(utility.getDbHandlerPath());
var DbConstants = require(utility.getDbConstantsPath());
var Constants = require(utility.getConstantsPath());
var RedisCache = require(utility.getRedisCachePath());

exports.signUp = function(req, res) {
	
	console.log("Inside sign up");
	response = res;
	p = new Person();
	p.createFromRequest(req);
	
	// Validate all the details
	var errors = p.validateAll();
	
	// If details are invalid then return error message
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		var userLogin = p.getUserLogin();
		var insertUserLoginValueMap = userLogin.getValuesMap();
		db.insert(DbConstants.USER_LOGIN_TABLE, insertUserLoginValueMap, onInsertLoginDetailsResponse);
	}
};

/**
 * On insertion of login details insert person details
 * @param err
 * @param result
 */
function onInsertLoginDetailsResponse(err, result) {
	// If error then return appropriate error message
	if(err) {
		var errorMessage;
		if(err.message.indexOf("ER_DUP_ENTRY") > -1) {
			errorMessage = "Email id is already present. Please use other email id.";
		} else {
			errorMessage = err.message;
		}
		utility.writeFailureJSON(response, errorMessage);
	} else {
		p.setUserLoginId(result.insertId);
		var insertValueMap = p.getValuesMap();
		db.insert(DbConstants.PERSON_TABLE, insertValueMap, onInsertPersonDetailsResponse);
	}
}

function onInsertPersonDetailsResponse(err, result) {
	if(err) {
		utility.writeFailureJSON(response, err.message);
	} else {
		console.log(result);
		utility.writeSuccessJSON(response, p.toJSON(), "Sign up successful");
	}
}

exports.deleteMember = function(req, res) {
	console.log("Inside delete member");
	response = res;
	var userLogin = new UserLogin();
	console.log(req.body);
	userLogin.createFromRequest(req);
	console.log(userLogin.id);
	db.execSQL(userLogin.getDisablePersonQuery(), onPersonDeleted);
};

function onPersonDeleted(err, result) {
	console.log(result);
	if(err) {
		utility.writeFailureJSON(response, err.message);
	} else {
		utility.writeSuccessJSON(response, {}, "Member deleted successfully");
	}
}

exports.listAllPremiumMembers = function(req, res) {
	console.log("Inside list all premium members");
	response = res;
	db.execSQL(Person.getListPremiumMembersQuery(), onAllPersonsListFetched);
};

exports.listAllSimpleCustomers = function(req, res) {
	console.log("Inside list all simple customers");
	response = res;
	db.execSQL(Person.getListSimpleCustomersQuery(), onAllPersonsListFetched);
};

exports.listAllPersons = function(req, res) {
	console.log("Inside list all persons");
	response = res;
	db.execSQL(Person.getListAllPersonsQuery(), onAllPersonsListFetched);
};

function onAllPersonsListFetched(err, result) {
	if(err) {
		utility.writeFailureJSON(response, err.message);
	} else {
		var allPersonsList = {};
		allPersonsList[Constants.PERSONS] = result;
		utility.writeSuccessJSON(response, allPersonsList, "Details fetched successfully");
	}
}
 
exports.editPersonInfo = function(req, res) {
	console.log("Inside edit person info");
	response = res;
	p = new Person();
	p.createFromRequest(req);
	
	// Validate all the details
	var errors = p.validateUpdateInfo();
	
	// If details are invalid then return error message
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		// Update password
		var userLogin = p.getUserLogin();
		db.update(userLogin.getUpdateUserLoginQuery(), userLogin.getUpdateUserLoginValuesMap(), function(err, result){
			if(!err) {
				db.update(p.getUpdatePersonInfoQuery(), p.getUpdateValuesMap(), onPersonDetailsUpdated);
			} else {
				var errorMessage;
				if(err.message.indexOf("ER_DUP_ENTRY") > -1) {
					errorMessage = "Email id is already present. Please use other email id.";
				} else {
					errorMessage = err.message;
				}
				utility.writeFailureJSON(res, errorMessage);
			}
		});
	}
};

function onPersonDetailsUpdated(err, result) {
	console.log(result);
	if(!err) {
		utility.writeSuccessJSON(response, p.toJSON(), 'Details updated successfully');
	} else {
		utility.writeFailureJSON(response, err.message);
	}
}

exports.searchPerson = function(req, res) {
	console.log("Inside search person");
	response = res;
	utility.writeSuccessJSON(res, {data : 'Inside search person'});
};

exports.signIn = function(req, res) {
	console.log("Inside sign in person");
	response = res;
	userLogin = new UserLogin();
	userLogin.createFromRequest(req);
	
	var errors = userLogin.validateAll();
	
	// If details are invalid then return error message
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		db.execSQL(userLogin.getSignInQuery(), isSignIn);
	}
};

function isSignIn(err, result) {
	if(err) {
		utility.writeFailureJSON(response, err.message);
	} else {
		// Check if there are any details in result
		if(result.length > 0) {
			// Check user status marked as disabled
			if(result[0][DbConstants.IS_DISABLED] == 1) {
				utility.writeFailureJSON(response, "User status marked as disabled. Please contact admin.");
			} else {
				var signInRes = {};
				signInRes[Constants.IS_ADMIN] = (userLogin.getEmail() === 'admin@admin.com' ? true : false);
				signInRes[Constants.EMAIL] = userLogin.getEmail();
				utility.writeSuccessJSON(response, signInRes, "Sign in successful");
			}
		} else {
			// There are no details in result
			utility.writeFailureJSON(response, "Invalid credentials");
		}
	}
}

exports.getStateAndMembershipDetails = function(req, res) {
	console.log("Inside getStateAndMembershipDetails");
	var State = require(utility.getModelsPath() + '/state');
	var Membership = require(utility.getModelsPath() + '/membership');
	var data = {};
	//data[Constants.STATES] = State.getCachedStates();
	RedisCache.getCachedStates(function(err, usStatesResults) {
		if(!err)
		{
			data[Constants.STATES] = usStatesResults;
			
			RedisCache.getCachedMembershipTypes(function(err, membershipTypes){
				if(!err)
				{		
					data[Constants.MEMBERSHIP_TYPES] = membershipTypes;
					utility.writeSuccessJSON(res, data, "Details fetched successfully");
				}
				else
				{
					res.end(err);
				}	
			});
		}
		else
		{
			res.end(err);
		}
	});
}

/**
 * Customer bill payment
 * Input: person_id, amount
 */
exports.payBill = function(req, res) {
	console.log("Inside payBill");
	
	billPayment = new BillPayment();
	billPayment.createFromRequest(req);
	
	var errors = billPayment.validateAll();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		console.log(billPayment.getValuesMap());
		db.insert(DbConstants.BILL_PAYMENT_TABLE, billPayment.getValuesMap(), function(err, result) {
			if(!err) {
				
				// Mark payment done in issue_movies
				var issueMovie = new CustomerMovie();
				issueMovie.createFromRequest(req);
				
				db.update(issueMovie.getUpdateAmountPaidQuery(), issueMovie.getUpdateAmountPaidMap(), function(err, result) {
					if(!err) {
						utility.writeSuccessJSON(res, {}, 'Payment successful');
					} else {
						utility.writeFailureJSON(res, err.message);
					}
				});
			} else {
				utility.writeFailureJSON(res, "Unable to complete payment");
			}
		});
	}
};

exports.enableMember = function(req, res) {
	console.log("Inside enableMember");
	response = res;
	var userLogin = new UserLogin();
	userLogin.createFromRequest(req);
	//console.log(userLogin.id);
	db.execSQL(userLogin.getEnablePersonQuery(), function(err, result) {
		console.log(result);
		if(err) {
			utility.writeFailureJSON(res, err.message);
		} else {
			utility.writeSuccessJSON(res, {}, "Member status marked as active");
		}
	});
};

exports.getMemberInfo = function(req, res) {
	console.log("Inside getMemberInfo");
	response = res;
	p = new Person();
	p.createFromRequest(req);
	db.execSQL(p.getMemberInfoQuery(), onAllPersonsListFetched);
};