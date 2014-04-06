/**
This controller contains all the messaging done for UserManagement.
*/

var path = require('path');
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
	
	/**
	Access to the recovery page is not allowed (403 error) unless a valid code is provided
	*/
	app.get("/recovery.html", function(req, res) {
		if(req.query.code) {
			manager.validateCode(parseInt(req.query.code), function(err, success) {
				if(err) {
					console.log(err);
					res.send(403);
				}
				else {
					res.sendfile(path.resolve(__dirname + '/../public/recovery.html'));
				}
			});
		}
		else {
			console.log("No code given to access recovery page.");
			res.send(403);
		}
	});
	
	app.io.route("recoveryCode", function(req) {
	
		manager.createRecoveryCode(req.data, function(err, success) {
			if(err) {
				req.io.emit("recoveryCodeError", err);
				console.log(err);
			}
			
			else if(!success) {
				req.io.emit("recoveryCodeError", "Failed to generate recovery code!");
			}
			
			else {
				req.io.emit("recoveryCode", "Successfully created code!");
			}
			
		});
		
	});
	
	app.io.route("recoveryPassword", function(req) {
	
		console.log("Received event to recover password: " + JSON.stringify(req.data));

		manager.recoverPassword(req.data, function(err, success) {
			if(err) {
				req.io.emit("recoveryPasswordError", err);
				console.log(err);
			}
			
			else if(!success) {
				req.io.emit("recoveryPasswordError", "Failed to update password!");
			}
			
			else {
				req.io.emit("recoveryPassword", "Successfully updated password!");
			}
		});
	});
}