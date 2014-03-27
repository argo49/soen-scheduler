/**
This controller contains all the messaging done for UserManagement.
*/

var UserManagement = require("../models/UserManagement.js");

//Idea to make controller is from Tim Roberts on his blog

module.exports.controller = function(app) {

	app.io.route("createUser", function(req) {
		UserManagement.createUser(req.data);
	});

}
