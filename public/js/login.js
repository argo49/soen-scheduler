

var socket = io.connect();

var emailValidated;
var passwordValidated;

$(document).ready(function() {



	// manual login
	$('.login.button').on('click', function () {
		if (validateEmail() && validatePassword()) {
			var loading = $('.dimmer');
			socket.emit('login', {"emailAddress" : emailValidated, "password" : passwordValidated});	
			loading.dimmer('show');
			socket.on('login', function(data) {
				console.log(data);
				loading.dimmer('hide');
				window.location.assign("home.html");
			});	
			socket.on('loginError', function(data) {
				console.log(data);
				var email     = $('input[type=text]');
				var uField    = email.closest('.field');
				var uiForm    = email.closest('.ui.form.segment');
				var errorCont = uiForm.find('.ui.error.message');
				uField.add(uiForm).addClass('error');
				var err = $('<li/>').text("This account has not been registered. Click signup to create an accout!");
				if (errorCont.find('li:contains("This account has not been registered. Click signup to create an accout!")').length < 1) {
					errorCont.append(err);
				}
				loading.dimmer('hide');
			});	

		} else {
			console.log('not valid credentials!');
		}
	});
	
	//	signup
	$('.signup.button').on('click', function () {
		if(validateEmail() && validatePassword()){
			// create user
			socket.emit('createUser', {"emailAddress" : emailValidated, "password" : passwordValidated});
			socket.on('createUser', function(data) {
				console.log(data);
				// upon successful creation login user
				socket.emit('login', {"emailAddress" : emailValidated, "password" : passwordValidated});	
				socket.on('login', function(data) {
					console.log(data);
					window.location.assign("profile.html");
				});	
			});
		} else {
			console.log('not valid credentials!');
		}
	});

});

function validateFields() {
	if(validateEmail() && validatePassword()){
		socket.emit('createUser', {"emailAddress" : emailValidated, "password" : passwordValidated});
		socket.on('createUser', function(dataReceived) {console.log(dataReceived)});
	}
}

function validateEmail() {
	var email            = $('input[type=text]');
	var uField           = email.closest('.field');
	var uiForm           = email.closest('.ui.form.segment');
	var lengthErrorStr   = 'Your email must be more than 3 characters in length.';
	var formatErrorStr   = 'Check the format of your email address.';
	var errorCont        = uiForm.find('.ui.error.message');
	var emailLengthError = errorCont.find('li:contains(' + lengthErrorStr + ')');
	var emailFormatError = errorCont.find('li:contains(' + formatErrorStr + ')');

	// email can't be null and must have 4 or more characters
	if (!email.val() || email.val().length < 4) {

		// there's an error: add the error class to display warnings
		uField.add(uiForm).addClass('error');
		
		// if the email error bullet doesnt already exist, add it!
		if (!emailLengthError.length) {
			errorCont.append($('<li/>').text(lengthErrorStr));	
		}

		emailValidated = null;
		return false;

	} else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.val())) {
		// Length of the email is good if we get to this point
		emailLengthError.remove();
		// An 
		uField.add(uiForm).addClass('error');
		if (!emailFormatError.length) {
			errorCont.append($('<li/>').text(formatErrorStr));	
		}

		emailValidated = null;
		return false;
	} else {

		// No email error
		uField.removeClass('error');
		emailLengthError.remove();
		emailFormatError.remove();


		// If there are no more errors, remove the error message
		if (!errorCont.find('li').length) {
			uiForm.removeClass('error');
		}

		emailValidated = email.val();
		return true;
	}
}

function validatePassword() {
	var password      = $('input[type=password]');
	var pField        = password.closest('.field');
	var uiForm        = password.closest('.ui.form.segment');
	var errorStr      = 'Your password must be more than 7 characters in length.';
	var errorCont     = uiForm.find('.ui.error.message');
	var passwordError = errorCont.find('li:contains(' + errorStr + ')');

	// password can't be null and must have 8 or more characters
	if (!password.val() || password.val().length < 7) {

		// there's an error: add the error class to display warnings
		pField.add(uiForm).addClass('error');
		
		// if the username error bullet doesnt already exist, add it!
		if (!passwordError.length) {
			errorCont.append($('<li/>').text(errorStr));	
		}

		passwordValidated = null;
		return false;

	} else {

		// No password error
		pField.removeClass('error');
		passwordError.remove();

		// If there are no more errors, remove the error message
		if (!errorCont.find('li').length) {
			uiForm.removeClass('error');
		}

		passwordValidated = password.val();
		return true;
	}
}