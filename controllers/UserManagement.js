/**
This controller contains all the messaging done for UserManagement.
*/

var UserManagement = require("../models/UserManagement.js");
manager = new UserManagement.AccountManager();

//Idea to make controller is from Tim Roberts on his blog

module.exports.controller = function(app) {

	/**
	Event to create a new user in the database
	*/
	app.io.route("createUser", function(req) {

		manager.createUser(req.data, req, function(err, success) {
			if(err) {
				req.io.emit("createUserError", err);
				console.log(err);
			}
			else {
				req.io.emit("createUser", "Successfully created user!");
			}
		});
		
	});
	
	/**
	Event to login a user
	*/
	app.io.route("login", function(req) {
		
		//Verify credentials of user
		manager.validateUser(req.data, function(err, result) {
		
			//If an error occured, send an error
			if(err) {
				req.io.emit("loginError", err);
				console.log(err);
			}
			
			//If the credentials are bad, send an error
			else if(!result) {
				req.io.emit("loginError", "Email/Password combination is invalid!");
			}
			
			//If the credentials are good, login the user
			else {
				manager.login(result, req, function() {
					req.io.emit("login", "Logged in user!");
				});
			}
			
		});
		
	});
	
	/**
	Event to logout a user
	*/
	app.io.route("logout", function(req) {
	
		manager.logout(req.session.user, req, function() {
			req.io.emit("logout", "Logged out user!");
		});
		
	});
	
	/**
	Event to delete a user from the database: requires valid password
	*/
	app.io.route("deleteUser", function(req) {
	
		manager.validateUser(req.data, function(err, result) {
			if(err) {
				req.io.emit("deleteUserError", err);
				console.log(err);
			}
			
			//If the credentials are bad, send an error
			else if(!result) {
				req.io.emit("deleteUserError", "Email/Password combination is invalid!");
			}
			
			else {
				manager.deleteUser(result, req, function(err, success) {
				
					if(err) {
						req.io.emit("deleteUserError", err);
						console.log(err);
					}
					else {
						req.io.emit("deleteUser", "Successfully deleted user!");
					}
					
				});
			}
		});
	});
	
	/**
	Event to request the user's data
	*/
	app.io.route("getSession", function(req) {
		req.io.emit("getSession", req.session.user);
	});
}
