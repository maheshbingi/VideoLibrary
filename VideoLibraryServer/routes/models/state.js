var utility = require("../utility");
var Validator = require(utility.getValidator());
var Constants = require(utility.getConstantsPath());
var DbConstants = require(utility.getDbConstantsPath());

var State = function (state) {
	this.state = state;
	this.setId();
}

/**
 * Creates State object from http request object
 * @param req
 */
State.prototype.createFromRequest = function(req) {
	this.state = req.param(Constants.STATE, null);
	this.setId();
}

/**
 * State state id only after setting state
 */
State.prototype.setId = function() {
	if(this.state != null) {
		for(var i = 0; i < State.usStates.length; i++) {
			var stateObject = State.usStates[i];
			if (stateObject[DbConstants.NAME] === this.state || stateObject[DbConstants.CODE] === this.state) {
				this.id = stateObject[DbConstants.ID];
				return;
			}
		}
	}
	this.id = Constants.ERROR_ID;
}

State.usStates = null;

// Cached states
State.cacheStates= function(usStates) {
	State.usStates = usStates;
};

State.getCachedStates= function() {
	console.log('State.usStates:- '+State.usStates);
	return State.usStates;
};

State.getSelectQuery = function() {
	return "SELECT " + DbConstants.ID + ", " + DbConstants.NAME + ", " + DbConstants.CODE + " FROM " + DbConstants.STATE_TABLE;
};

// State
State.prototype.setState = function(state) {
	this.state = state;
}

State.prototype.getState = function() {
    return this.state;
}

// Id
State.prototype.getId = function() {
    return this.id;
}

State.prototype.toJSON = function() {
	var state = {};
	state[Constants.STATE] = this.state;
	return state;
}

module.exports = State;