var global = {
	colors: [
		'#8e44ad', // purple
		'#3498db', // blue
		'#1abc9c', // turquoise
		'#2ecc71', // green
		'#f1c40f', // yellow
		'#e67e22', // orange
		'#e74c3c'  // red
	],
	courses: [],
	phoneMode: false
};

var phoneMenuSettings = {
	onShow: function () {
		console.log('showing menu');
		$('body').css('overflow', 'hidden');
	},
	onHide: function () {
		console.log('hiding the menu');
		$('body').css('overflow', 'scroll');
	},
	closable: false,
	selector: {close: '.icon.reply.mail'}
}

function updateMode() {
	if ($('.dummy').width() == 0) {
		global.phoneMode = true;
	} else {
		global.phoneMode = false;
	}
}

/************\
|    MAIN    |
\************/
$(document).ready(function(){

	// Create phone menu manager
	var phoneMenu = new PhoneMenuManager(phoneMenuSettings);

	// Create mainMenu manager
	var mainMenu = new MainMenuManager();

	// Attach the show function to the divider icon
	$('.white.action.divider .icon')
		.on('click', function () {
			phoneMenu.updateCourseList();
			phoneMenu.showMenu();
			mainMenu.updateCourseList();
			mainMenu.toggleMenu();
		});

	// Handle first time Menus on the ready
	updateMode();

	// Handles window resizing
	$(window).on('resize', function (){

		// Check to see if we're in phone mode and update the global
		updateMode();

		if (global.phoneMode == true) {
			mainMenu.hideMenu();
		} else {
			phoneMenu.hideMenu();
		}

	});

});

/************************\
|	MAIN MENU MANAGER    |
\************************/

function MainMenuManager (settings) {
	// JavaScript Hack
	var self = this;

	// Attributes
	this.sidebar = $('.pc.sidebar');
	this.addIcon = this.sidebar.find('.add.icon');
	this.input = this.sidebar.find('input');
	this.generateButton = this.sidebar.find('.button.generate');
	this.accordion = this.sidebar.find('.accordion');
	this.dropdown = this.sidebar.find('.dropdown');

	// Initialization
	this.addIcon.on('click', function () {
		self.addCourse();
		console.log('ADD');
	});
	this.input.on('keydown', function(e){
		if (e.which == 13) {
			self.addCourse();
		}
	});
	this.accordion.accordion();
	this.dropdown.dropdown();

	
	// Methods
	this.showMenu = function () {
		if (!global.phoneMode) {
			this.sidebar.sidebar('show');
			$('.container').one('click', function () {
				self.sidebar.sidebar('hide');
			});
		}
	}

	this.hideMenu = function () {
		this.sidebar.sidebar('hide');
	}

	this.toggleMenu = function () {
		if (!global.phoneMode && this.sidebar.sidebar('is closed')) {
			this.showMenu();
		} else {
			this.hideMenu();
		}
	}

	this.addCourse = addCourse;

	this.clearInvalidCourseError = function () {}
	this.invalidCourseError = function () {}

	this.updateCourseList = function () {
		this.sidebar.children('.course.item').remove();

		$.each(global.courses, function (idx, ele) {
			$(ele.handle).insertAfter(self.input.closest('.item'));
		})
	}

}

/*************************\
|	PHONE MENU MANAGER    |
\*************************/

function PhoneMenuManager (settings) {

	// JavaScript Hack
	var self = this;

	// Attributes	
	this.modal = $('.ui.modal');
	this.addIcon = $('.phone .menu .add.icon');
	this.input   = this.addIcon.siblings('input');
	this.accordion = $('.phone .ui.accordion');
	this.semesterDropdown = $('.phone .inline.dropdown');

	// Initialize the settings in the menu
	this.modal.modal(settings);
	this.accordion.accordion();
	this.semesterDropdown.dropdown();

	// Attaching Handlers
	this.input.on('keydown', function(e) {
		if (e.which == 13) {
			self.addCourse();
		}
	});
	this.addIcon.on('click', function () {
		self.addCourse();
	});

	// Shows the menu
	this.showMenu = function() {
		if (global.phoneMode) {
			this.modal.modal("show");
		}
	}

	// Hides the menu
	this.hideMenu = function() {
		this.modal.modal("hide");
		this.clearInvalidCourseError();
		this.input.val("");
	}

	// Vet the course and add it to the list
	this.addCourse = addCourse;

	this.invalidCourseError = function (errStr) {
		// Make the text input red
		this.input.parent().addClass('error');

		// Make the button red
		this.addIcon.addClass('red');
		
		// Show the error message
		this.input.closest('.item').find('.error.message')
			.removeClass('hidden')
			.text(errStr);
	}

	this.clearInvalidCourseError = function () {
		this.input.parent().removeClass('error');
		this.addIcon.removeClass('red');
		this.input.closest('.item').find('.error.message').addClass('hidden');
	}

	this.removeCourse = function(course) {
		if (!course || typeof course !== "object") {
			return false;
		}

		var courses = global.courses;

		for (var i = 0; i < courses.length; i++) {

			if (courses[i] == course) {

				// Remove the course from the DOM
				courses[i].handle.remove();

				// Remove the matching course from the list and preserve it
				var removedCourse = courses.splice(i, 1)[0];

				// Put it's color back in the pool
				global.colors.push(removedCourse.color);

			}
		}

	}

	this.updateCourseList = function () {
		this.modal.children('.course.item').remove();
		$.each(global.courses, function (idx, ele) {
			ele.handle.insertAfter(self.input.closest('.item'))
		})
	}
}

/**************\
|    COURSE    |
\**************/

function Course(settings) {
	// This is all we need for this front-end object for now
	this.name   = settings.name || "";
	this.color  = settings.color || getFreeColor();
	this.handle = settings.handle || null;

}

function getFreeColor() {
	return global.colors.pop();
}

function checkCourse(courseName) {
	// Vet course name
	return /\w{4} ?\d{3}/.test(courseName);
}

/*****************\
|    ADDCOURSE    |
\*****************/
function addCourse() {

	// Focus the text input if there is nothing there
	if (this.input.val() == "" || !this.input.val()) {
		this.input.focus();
		return;
	}

	// Get course name from inout
	var courseName = this.input.val().toUpperCase();

	// Can;t have more than seven courses at a time
	if (global.courses.length < 7) {

		// Checks to make sure it's a valid course
		if (checkCourse(courseName)) {

			this.clearInvalidCourseError();

			// Clear the input field
			this.input.val("");

			var course = new Course({
				name: courseName
			});

			course.handle = 
				$('<a/>')
					.text(courseName)
					.addClass('course item')
					.prepend($('<i/>')
						.addClass('ui close icon'))
					.prepend($('<div/>')
						.addClass('ui label')
						.css('background-color', course.color));
			
			// Attach handler for removing the course
			course.handle.find('i.close').on('click', function () {
				self.removeCourse(course);
			});

			// Adds the course to the list of courses
			global.courses.push(course);
			
			// Insert course into DOM				
			course.handle.insertAfter(this.input.closest('.item'));

			// Now that class has been added, change prompt
			var prompt = $('.prompt');
			prompt.find('h2').text("You're now ready to generate your schedule!");
			prompt.find('p').text('the generate button generate your schedule');

		} else {
			// Not a valid course name
			if (courseName.slice(8)) {
				courseName =  courseName.slice(0,8) + "..."
			}
			this.invalidCourseError('The course "' + courseName + '" does not exist!');
			this.input.focus();
		}
	} else {
		// Can;t have more than 7 courses
		this.invalidCourseError('There are already seven courses added!');
	}
}

