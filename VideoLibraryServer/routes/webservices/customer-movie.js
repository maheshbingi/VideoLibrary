var utility = require("../utility");
var CustomerMovie = require(utility.getModelsPath() + '/customer-movie');
var Constants = require(utility.getConstantsPath());
var db = require(utility.getDbHandlerPath());
var DbConstants = require(utility.getDbConstantsPath());
var MAX_MOVIES_SIMPLE_CUSTOMER = 2;
var MAX_MOVIES_PREMIUM_MEMBER = 10;

exports.issueMovie = function(req, res) {
	customerMovie = new CustomerMovie();
	customerMovie.createFromRequest(req);
	response = res;
	var errors = customerMovie.validateAll();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		// First check whether movie is available or not
		db.execSQL(customerMovie.getMovie().isMovieAvailableQuery(), function(err, result) {
			if(!err) {
				if(result.length > 0) {
					// Check if copies are available or not
					if(result[0][DbConstants.AVAILABLE_COPIES] > 0) {
						
						// Check type of member
						var member = customerMovie.getCustomer();
						
						db.execSQL(member.getMemberTypeIdQuery(), function(err, result) {
							
							if(!err) {
								
								var membershipTypeId = result[0][DbConstants.MEMBERSHIP_TYPE_ID];
								
								// Get number of movies issued to customer
								db.execSQL(customerMovie.getMoviesCountIssuedToCustomerQuery(), function(err, result) {
									if(!err) {
										var issuedMoviesCount = result[0][DbConstants.ISSUED_MOVIES_COUNT];
										console.log("Issued movie count --> " + issuedMoviesCount);
										console.log("Member type --> " + membershipTypeId);
										/**
										 * Simple Membership	: ID : 1
										 * Premium Membership	: ID : 2
										 */
										if(membershipTypeId == 1) {
											
											if(issuedMoviesCount < MAX_MOVIES_SIMPLE_CUSTOMER) {
												issueMovieToCustomer();
											} else {
												utility.writeFailureJSON(response, "Simple customer cannot issue more than " + MAX_MOVIES_SIMPLE_CUSTOMER + " movies");
											}
											
										} else if(membershipTypeId == 2) {
											
											if(issuedMoviesCount < MAX_MOVIES_PREMIUM_MEMBER) {
												// Check whether amt is paid
												
												getPremiumMemberBillDetails(function(bill) {
													
													if(bill[Constants.STATUS]) {
														var outStandingBalance = bill[Constants.BILL_AMOUNT];
														if(outStandingBalance == 0) {
															issueMovieToCustomer();
														} else {
															utility.writeFailureJSON(res, bill[Constants.MESSAGE]);
														}
													} else {
														utility.writeCustomFailureJSON(res, bill);
													}
													
												});
												
											} else {
												utility.writeFailureJSON(response, "Premium member cannot issue more than " + MAX_MOVIES_PREMIUM_MEMBER + " movies");
											}
											
										} else {
											utility.writeFailureJSON(response, "Unknown membership type");
										}
									} else {
										utility.writeFailureJSON(response, err.message);
									}
								});
								
							} else {
								utility.writeFailureJSON(response, err.message);
							}
						});
					} else {
						utility.writeFailureJSON(response, "No copies of this movie are available");
					}
					
				} else {
					utility.writeFailureJSON(response, "No movie details found");
				}
				
			} else {
				utility.writeFailureJSON(response, err.message);
			}
		});
	}
};

/**
 * Issues movie to customer
 */
function issueMovieToCustomer() {
	console.log("Issuing movie");
	var issueMovieMap = customerMovie.getIssueMovieMap();
	db.insert(DbConstants.ISSUED_MOVIES, issueMovieMap, function(err, result) {
		
		if(!err) {
			var movie = customerMovie.getMovie();
			db.execSQL(movie.decrementAvailableCopiesQuery(), function(err, result) {
				if(!err) {
					utility.writeSuccessJSON(response, {}, 'Movie issued successfully');
				} else {
					utility.writeFailureJSON(response, err.message);
				}
			});
		} else {
			utility.writeFailureJSON(response, err.message);
		}
	});
}

exports.submitMovie = function(req, res) {
	console.log("Inside submitMovie");
	
	customerMovie = new CustomerMovie();
	customerMovie.createFromRequest(req);
	response = res;
	var errors = customerMovie.validateId();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		
		db.execSQL(customerMovie.getIssuedMovieDetailsQuery(), function(err, result) {
			if(!err) {
				console.log(result);
				movie = customerMovie.getMovie();
				movie.setId(result[0][DbConstants.MOVIE_ID]);
				
				var submittedDate = result[0][DbConstants.SUBMITTED_DATE];
				
				// If submitted date is not null, then movie is already submitted
				if(submittedDate == null) {
					
					db.update(customerMovie.getSubmitMovieQuery(), customerMovie.getSubmitMovieMap(), function(err, result) {
						if(!err) {
							// Increment movie copies
							db.execSQL(movie.incrementAvailableCopiesQuery(), function(err, result) {
								if(!err) {
									utility.writeSuccessJSON(response, {}, 'Movie submitted successfully');
								} else {
									utility.writeFailureJSON(response, err.message);
								}
							});
								
						} else {
							utility.writeFailureJSON(response, err.message);
						}
					});
				} else {
					utility.writeFailureJSON(response, "Movie already submitted");
				}
				
			} else {
				utility.writeFailureJSON(response, err.message);
			}
		});
	}
};

/**
 * Returns list of movies issued to particular person.
 * Input: person_id
 */
exports.listMoviesIssuedToPerson = function(req, res) {
	console.log("Inside listMoviesIssuedToPerson");
	customerMovie = new CustomerMovie();
	customerMovie.createFromRequest(req);
	
	var errors = customerMovie.validateCustomerId();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		
		db.execSQL(customerMovie.getMoviesIssuedToCustomerQuery(), function(err, result) {
			if(!err) {
				console.log(result);
				var moviesList = {};
				moviesList[Constants.MOVIES] = result;
				utility.writeSuccessJSON(res, moviesList, "Details fetched successfully");
			} else {
				utility.writeFailureJSON(response, err.message);
			}
		});
	}
};


/**
 * Returns list of persons who issued to particular movie.
 * Input: movie_id
 */
exports.listPersonsIssuedMovie = function(req, res) {
	console.log("Inside listPersonsIssuedMovie");
	customerMovie = new CustomerMovie();
	customerMovie.createFromRequest(req);
	
	var errors = customerMovie.validateMovieId();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		console.log(customerMovie.getCustomersIssuedMovieQuery());
		db.execSQL(customerMovie.getCustomersIssuedMovieQuery(), function(err, result) {
			if(!err) {
				console.log(result);
				var personsList = {};
				personsList[Constants.PERSONS] = result;
				utility.writeSuccessJSON(res, personsList, "Details fetched successfully");
			} else {
				utility.writeFailureJSON(response, err.message);
			}
		});
	}
};

/**
 * Returns bill amount for premium member
 * Input: person_id
 */
function generateBillForPremiumMember (req, res) {
	console.log("Inside generateBillForPremiumMember");
	customerMovie = new CustomerMovie();
	customerMovie.createFromRequest(req);
	
	var errors = customerMovie.validateCustomerId();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		console.log(customerMovie.getPremiumMemberGenerateBillQuery());
		
		getPremiumMemberBillDetails(function(bill) {
			
			if(bill[Constants.STATUS]) {
				utility.writeSuccessJSON(res, bill);
			} else {
				utility.writeFailureJSON(res, bill);
			}
		});
	}
};

function getPremiumMemberBillDetails(callBack) {
	db.execSQL(customerMovie.getPremiumMemberGenerateBillQuery(), function(err, result) {
		
		if(!err) {
			console.log(result);
			var bill = {};
			bill[Constants.STATUS] = true;
			
			var latestPaymentDate = result[0][DbConstants.LATEST_PAYMENT_DATE];
			if(latestPaymentDate != null) {
				
				var monthDiff = utility.monthDiff(latestPaymentDate);
				
				if(monthDiff > 0) {
					bill[Constants.BILL_AMOUNT] = monthDiff * 10;
					bill[Constants.MESSAGE] = "You have not paid monthly subscription fee";
				} else {
					bill[Constants.BILL_AMOUNT] = 0;
					bill[Constants.MESSAGE] = "You do not have outstanding balance";
				}
				
			} else {
				bill[Constants.BILL_AMOUNT] = 10;
				bill[Constants.MESSAGE] = "You have not paid monthly subscription fee";
			}
		} else {
			bill[Constants.STATUS] = false;
			bill[Constants.ERRORS] = err.message;
		}
		
		console.log("Bill details -> " + JSON.stringify(bill));
		if(callBack != null) {
			callBack(bill);
		}
	});
}

/**
 * Returns bill amount for simple customer
 * Input: person_id
 */
function generateBillForSimpleCustomer(req, res) {
	console.log("Inside generateBillForSimpleCustomer");
	
	customerMovie = new CustomerMovie();
	customerMovie.createFromRequest(req);
	
	var errors = customerMovie.validateCustomerId();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		db.execSQL(customerMovie.getSimpleCustomersGenerateBillQuery(), function(err, result) {
			if(!err) {
				console.log(result[0][DbConstants.BILL]);
				var bill = {};
				
				if(result[0][DbConstants.BILL] == null) {
					bill[Constants.BILL_AMOUNT] = 0;
					bill[Constants.MESSAGE] = "You do not have outstanding balance";
				} else {
					bill[Constants.BILL_AMOUNT] = result[0][DbConstants.BILL];
					bill[Constants.MESSAGE] = "You have to pay $ " + result[0][DbConstants.BILL];
				}
				
				utility.writeSuccessJSON(res, bill);
			} else {
				utility.writeFailureJSON(response, err.message);
			}
		});
	}
};


/**
 * Checks type of member and calls appropriate web service
 * Input: email_id
 */
exports.generateBillForCustomer = function(req, res) {
	console.log("Inside generateBillForCustomer");
	customerMovie = new CustomerMovie();
	customerMovie.createFromRequest(req);
	var errors = customerMovie.validateEmailId();
	if(!errors[Constants.STATUS]) {
		utility.writeCustomFailureJSON(res, errors);
	} else {
		db.execSQL(customerMovie.getCustomer().getMemberInfoQuery(), function(err, result) {
			if(!err) {
				console.log(result);
				req.body.person_id = result[0][Constants.PERSON_ID].toString();
				console.log(req.body);
				console.log("Member type --> " + result[0][DbConstants.MEMBERSHIP_TYPE_ID]);
				if(result[0][DbConstants.MEMBERSHIP_TYPE_ID] == 1) {
					generateBillForSimpleCustomer(req, res);
				} else {
					generateBillForPremiumMember(req, res);
					//res.redirect('/generateBillForPremiumMember');
				}
			} else {
				utility.writeFailureJSON(response, err.message);
			}
		});
	}
	
};