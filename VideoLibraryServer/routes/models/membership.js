var utility = require("../utility");
var Constants = require(utility.getConstantsPath());
var DbConstants = require(utility.getDbConstantsPath());

var Membership = function (membershipId) {
	this.id = membershipId;
}

Membership.prototype.createFromRequest = function(req) {
	this.id = req.param(Constants.MEMBERSHIP_TYPE_ID, null);
}

Membership.membershipTypes = null;

Membership.cacheMembershipTypes = function(membershipTypes) {
	Membership.membershipTypes = membershipTypes;
}

Membership.getCachedMembershipTypes = function() {
	return Membership.membershipTypes;
}

// Id
Membership.prototype.setId = function(id) {
	this.id = id;
}

Membership.prototype.getId = function() {
    return this.id;
}

Membership.prototype.getIntId = function() {
    return parseInt(this.id);
}

Membership.getSelectQuery = function() {
	return "SELECT " + DbConstants.ID + ", " + DbConstants.TYPE + ", " + DbConstants.AMOUNT + ", " + DbConstants.MAX_MOVIES + " FROM " + DbConstants.MEMBERSHIP_TABLE;
};

module.exports = Membership;
