/**
Module to manage accounts
Classes included: Account Manager
Imported Modules: User, Security
*/

var User = require("./User.js");
var Security = require("./Security.js");

//Some variables to define databases and collections that contain users

var USERS_DATABASE = "users";
var USERS_COLLECTION = "argonauts";

/**
Account Manager class to allow creation, deletion and validation of Users
*/
exports.AccountManager = function() {

	/**
	Create a user in the database
	*/
	this.createUser = function(user, callback) {

		//Look if user already exists first
		Security.find(USERS_DATABASE, USERS_COLLECTION, {"emailAddress":user.emailAddress}, function(err, results) {
			if(err)
				callback(err);
				
			//User exists
			else if(results.length != 0) {
				callback("AccountManager.createUser: The email address " + user.emailAddress + " is already in use.");
			}

			//User does not exist: proceed to creation
			else {
				Security.insert(USERS_DATABASE, USERS_COLLECTION, user, function(err, success) {
					if(err) callback(err);
					else callback(err, true);
				});
			}
		});
	}

	/**
	Removes a user from the database. Should always validate before using this!
	*/
	this.deleteUser = function(user, callback) {
		Security.find(USERS_DATABASE, USERS_COLLECTION, {"emailAddress":user.emailAddress}, function(err, results) {
			if(err)
				callback(err);
			else if(results.length == 0)
				callback("There is no email address " + user.emailAddress);
			else {
				Security.remove(USERS_DATABASE, USERS_COLLECTION, {"emailAddress":user.emailAddress}, function(err, success) {
					if(err)
						callback(err);
					else
						callback(err, true);
				});
			}
		});
	}

	/**
	
	*/
	this.validateUser = function(user, callback) {
		Security.find(USERS_DATABASE, USERS_COLLECTION, {"emailAddress":user.emailAddress}, function(err, results) {
			if(err)
				callback(err);
			else if (results.length == 0)
				callback("AccountManager.validateUser:The user " + user.emailAddress + " does not exist");
			else
				callback(err, results[0].password == user.password);
		});
	}
	
};
