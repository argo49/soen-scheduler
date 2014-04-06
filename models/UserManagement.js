/**
Module to manage accounts
Classes included: Account Manager
Imported Modules: User, Security, Nodemailer (third-party)
*/
var nodemailer = require("nodemailer");

var User = require("./User.js");
var Security = require("./Security.js");

//Some variables

var USERS_DATABASE = "users";
var USERS_COLLECTION = "argonauts";

var CODES_COLLECTION = "recovery";

var ARGONAUTS_EMAIL = "argonauts341@gmail.com";
var ARGONAUTS_PASSWORD = "341341341";

//Set up email

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: ARGONAUTS_EMAIL,
        pass: ARGONAUTS_PASSWORD
    }
});

/**
Account Manager class to allow creation, deletion and validation of Users
*/
exports.AccountManager = function() {

	/**
	Create a user in the database
	*/
	this.createUser = function(user, request, callback) {

		//Look if user already exists first
		Security.find(USERS_DATABASE, USERS_COLLECTION, {"emailAddress":user.emailAddress}, function(err, results) {
			if(err)
				callback(err);
				
			//User exists
			else if(results.length != 0) {
				callback("The email address " + user.emailAddress + " is already in use.");
			}

			//User does not exist: proceed to creation
			else {
				Security.insert(USERS_DATABASE, USERS_COLLECTION, user, function(err, success) {
					if(err) callback(err);
					else {
						request.session.user = user;
						delete request.session.password;
						request.session.save();
						callback(err, true);
					}
				});
			}
		});
	}

	/**
	Removes a user from the database. Should always validate before using this!
	*/
	this.deleteUser = function(user, request, callback) {
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
						request.session.destroy(callback(err, true));
				});
			}
		});
	}

	/**
	Verifies a user/password combination and returns the user that corresponds
	*/
	this.validateUser = function(user, callback) {
		Security.find(USERS_DATABASE, USERS_COLLECTION, {"emailAddress":user.emailAddress, "password":user.password}, function(err, results) {
			if(err)
				callback(err);
			else if (results.length == 0)
				callback("The user/password combination for " + user.emailAddress + " is invalid");
			else
				callback(err, results[0]);
		});
	}
	
	/**
	Logs in a user by associating their user data with a session. Should always validate before using this!
	*/
	this.login = function(user, request, callback) {
		request.session.user = removePasswordID(user);
		request.session.save();
		callback();
	}
	
	/**
	Logs out a user by destroying their session data
	*/
	this.logout = function(user, request, callback) {
		request.session.destroy(callback());
	}
	
	/**
	Generates a recovery code for a given email address
	*/
	this.createRecoveryCode = function(email, callback) {
		if(!email)
			callback("No email is provided for code creation.");
		else {
			getRandomInt(1000000, 9999999, function(code) {
				Security.update(USERS_DATABASE, CODES_COLLECTION, {"emailAddress":email}, {"emailAddress":email, "code":code}, {"upsert":true, "safe":true}, function(err, success) {
					if(err)
						callback(err);
					else
						callback(err, code);
				});
			});
		}
	}
	
	/**
	Verifies if a given code exists in the database
	*/
	this.validateCode = function(code, callback) {
		Security.find(USERS_DATABASE, CODES_COLLECTION, {"code":code}, function(err, results) {
			if(err)
				callback(err);
			else if(results.length == 0)
				callback("Invalid code " + code);
			else
				callback(err, true);
		});
	}
	
	/**
	Recovers a user's password by updating it with a new one
	*/
	this.recoverPassword = function(credentials, callback) {
	
		//Check if the code/email combination is valid
		Security.find(USERS_DATABASE, CODES_COLLECTION, {"code":parseInt(credentials.code), "emailAddress":credentials.emailAddress}, function(err, results) {
			//There was an error
			if(err)
				callback(err);
				
			//The combination does not exist
			else if(results.length == 0)
				callback("Invalid code/email combination: " + credentials.code + "/" + credentials.emailAddress);
				
			//The combination is valid: update password
			else {
				Security.update(USERS_DATABASE, USERS_COLLECTION, {"emailAddress":credentials.emailAddress}, {"password":credentials.password}, {"safe":"true"}, function(err, success) {
					if(err)
						callback(err);
					else {
						//Remove the code from the codes database
						Security.remove(USERS_DATABASE, CODES_COLLECTION, {"code":parseInt(credentials.code), "emailAddress":credentials.emailAddress}, function(err, success) {
							if(err)
								callback(err);
							else
								callback(err, success);
						});
					}	
				});
			}
		});
		
	}
	
};

/**
Email manager to send messages
*/
exports.EmailManager = function() {

	this.sendEmail = function(recipient, subject, message, callback) {
		if(!recipient || !subject || !message)
			callback("Missing information to send message.");
			
		else {
	
			var mailOptions = {
				from: "Argonauts <users@argonauts.com>", // sender address
				to: recipient, // list of receivers
				subject: subject, // Subject line
				text: message, // plaintext body
				html: message // html body
			}
			
			smtpTransport.sendMail(mailOptions, function(err, response){
				if(err) {
					callback(err);
				}
				else {
					console.log("Message sent: " + response.message);
					callback(err, true);
				}
			});
		}
	}
};

function removePasswordID(user) {
	if(user && user.password) delete user.password;
	if(user && user._id) delete user._id;
	return user;
}

function getRandomInt(lower, upper, callback) {
    callback(Math.floor(lower + (Math.random() * (upper - lower + 1))));
}