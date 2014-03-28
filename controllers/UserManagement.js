/**
This controller contains all the messaging done for UserManagement.
*/

var UserManagement = require("../models/UserManagement.js");

//Idea to make controller is from Tim Roberts on his blog

module.exports.controller = function(app) {

	app.io.route("createUser", function(req) {
		manager = new UserManagement.AccountManager();

		manager.createUser(req.data, function(err, success) {
			if(err) {
				req.io.emit("createUser", "Error!");
				console.log(err);
			}
			else
				req.io.emit("createUser", "Success!");
		});
		
	});

}
