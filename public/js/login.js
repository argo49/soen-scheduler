$(document).ready(function() {
	$('.button').on('click', validateFields);
	$('input[type=text]').on('blur', validateUsername);
	$('input[type=password]').on('blur', validatePassword);
});

function validateFields() {
	validateUsername();
	validatePassword();
}

function validateUsername() {
	var username      = $('input[type=text]');
	var uField        = username.closest('.field');
	var uiForm        = username.closest('.ui.form.segment');
	var errorStr      = 'Your username must be more than 3 characters in length.';
	var errorCont     = uiForm.find('.ui.error.message');
	var usernameError = errorCont.find('li:contains(' + errorStr + ')');

	// username can't be null and must have 4 or more characters
	if (!username.val() || username.val().length < 4) {

		// there's an error: add the error class to display warnings
		uField.add(uiForm).addClass('error');
		
		// if the username error bullet doesnt already exist, add it!
		if (!usernameError.length) {
			errorCont.append($('<li/>').text(errorStr));	
		}

	} else {

		// No username error
		uField.removeClass('error');
		usernameError.remove();

		// If there are no more errors, remove the error message
		if (!errorCont.find('li').length) {
			uiForm.removeClass('error');
		}
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

	} else {

		// No password error
		pField.removeClass('error');
		passwordError.remove();

		// If there are no more errors, remove the error message
		if (!errorCont.find('li').length) {
			uiForm.removeClass('error');
		}
	}
}