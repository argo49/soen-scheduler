/************************\
|    GLOBAL VARIABLES    |
\************************/
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
	phoneMode: false,
	scheduleIds: [0]
},


phoneMenuSettings = {
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
};


/*************************\
|    UTILITY FUNCTIONS    |
\*************************/

function getFreeColor() {
	return global.colors.pop();
}

function validateCourse(courseName) {
	// Vet course name
	return /\w{4} ?\d{3}/.test(courseName);
}

function updateMode() {
	if ($('.dummy').width() == 0) {
		global.phoneMode = true;
	} else {
		global.phoneMode = false;
	}
}

/*******************\
|    MAIN METHOD    |
\*******************/
$(document).ready(function(){

	// Create and initialize phone menu manager
	var phoneMenu = new Menu({selector: ".modal"});
	phoneMenu.init(function () {
		phoneMenu.container.modal(phoneMenuSettings);
		phoneMenu.showMenu = function () {
			if (global.phoneMode) {
				this.updateCourseList();
				this.clearCourseError();
				this.container.modal('show');
			}
		};

		phoneMenu.hideMenu = function() {
			this.container.modal("hide");
			this.input.val("");
		}
	});

	// Create and initialize mainMenu manager
	var mainMenu = new Menu({selector:'.sidebar'});
	mainMenu.init(function () {
		// Show function 
		mainMenu.showMenu = function () {
			if (!global.phoneMode) {
				this.clearCourseError();
				this.updateCourseList();
				this.container.sidebar('show');
			}
		}

		// Hide function
		mainMenu.hideMenu = function () {
			this.container.sidebar('hide');
		}

		// Toggle sidebar
		mainMenu.toggleMenu = function () {
			if (this.container.sidebar('is open')) {
				this.container.sidebar('hide');
			} else {
				this.showMenu();
			}
		}
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

	// Attach event to calendar icon
	$('.white.action.divider .icon')
		.on('click', function () {
			phoneMenu.showMenu();
			mainMenu.toggleMenu();
		});
	var s1 = new ScheduleManager();
	var s2 = new ScheduleManager();
	var s3 = new ScheduleManager();
	var s4 = new ScheduleManager();
	var s5 = new ScheduleManager();
	var s6 = new ScheduleManager();
	s1.insert();


});

/************\
|    MENU    |
\************/

function Menu (settings) {

	if (typeof settings !== "object" || !settings.selector || $(settings.selector).length == 0){
		console.error('Settings does not contain a valid jQuery selector');
		return;
	}

	// for callbacks and stuff
	var self = this;

	// Attributes
	this.container = $(settings.selector);
	this.input     = this.container.find('input');
	this.generate  = this.container.find('.generate.button');
	this.addIcon   = this.container.find('.add.icon');	
	this.accordion = this.container.find('.accordion');
	this.dropdown  = this.container.find('.dropdown'); 

	// Initializers
	// Options, show and hide methods should be defined in the callback
	this.init = function (callback) {
		
		$(document).on('keyup', function (e) {
			self.keyHandler(e.which);
		})

		this.input.on('keydown', function (e) {
			if (e.which == 13) {
				self.addCourse();
			} 
		});

		this.addIcon.on('click', function () {
			if (!self.noInput()) {
				self.addCourse();				
			}
		});

		this.generate.on('click', function () {
			if (!self.noInput()) { 
				// do smthg
			}
		});

		this.accordion.accordion();
		this.dropdown.dropdown();

		if (typeof callback === "function") {
			callback();
		}
	}

	// Should be overridden
	this.showMenu = function () {}

	// Should be overriden
	this.hideMenu = function () {}

	// Add a course to the menu and global
	this.addCourse = function addCourse() {

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
			if (validateCourse(courseName)) {

				this.clearCourseError();

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
				this.courseError('The course "' + courseName + '" does not exist!');
				this.input.focus();
			}
		} else {
			// Can;t have more than 7 courses
			this.courseError('There are already seven courses added!');
		}
	}

	this.removeCourse = function (course) {
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

	this.courseError = function (errStr) {

		// Make the text input red
		this.input.parent().addClass('error');

		// Make the button red
		this.addIcon.addClass('red');

		// Show the error message
		this.input.closest('.item').find('.error.message')
			.removeClass('hidden')
			.text(errStr);
	}

	this.clearCourseError = function () {
		// Remove error Class
		this.input.parent().removeClass('error');

		// Remove red color
		this.addIcon.removeClass('red');

		// Hide the current error, if any
		this.input.closest('.item').find('.error.message').addClass('hidden');
	}

	this.noInput = function () {
		var isEmpty = this.input.val() == "";
		if (isEmtpty) {
			this.input.focus();
		}
		return isEmtpy;
	}

	this.updateCourseList = function () {
		// Remove the courses in the contianer
		this.container.children('.course.item').remove();

		for (var i = 0; i < global.courses.length; i++) {
			global.courses[i].handle.insertAfter(this.input.closest('.item'))
		}

		/* Add each course to the list
		$.each(global.courses, function (idx, ele) {
			ele.handle.insertAfter(self.input.closest('.item'))
		})*/
	}

	this.keyHandler = function (num) {
		switch (num) {
			// Escape key
			case 27 :
				this.hideMenu();
				break;
			// Left arrow
			case 37:
				this.hideMenu();
				break;
			// Right arrow 39
			case 39:
				this.showMenu();
				break;
		}
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

/************************\
|    Schedule Manager    |
\************************/

function ScheduleManager(settings) {
	var self = this;

	this.insert = function () {
		var lastSched = $('.container .row.schedule:last');
		this.container.insertAfter(lastSched);
	}

	this.newScheduleHandle = function () {
		var schedule = $('.row.schedule:first').clone(true, true);
		schedule.find('td').removeClass();
		schedule.find('.semester').add('.title').text("");
		return schedule;
	}

	this.deleteSchedule = function () {
		if (!this.isSaved) {
			this.container.remove();
		} else {
			if (confirm('Are you sure you want to delete this saved schedule?')) {
				this.container.remove();
				// do server things to unsave
			} else {
				// do nothing
			}
		}
		
	}

	this.saveSchedule = function () {
		this.saveIcon.css("background-color", "#C3FFD2");
		this.isSaved = true;
		// server things
	}
	
	this.id = (settings)? settings.id : getUniqueScheduleId();
	this.title = (settings)? settings.title : "";
	this.container = (settings)? $(settings.selector) : this.newScheduleHandle();
	this.saveIcon = this.container.find('.icon.save');
	this.closeIcon = this.container.find('.icon.close');
	this.isSaved = false;

	this.closeIcon.on('click', function () {
		self.deleteSchedule();
	});

	this.saveIcon.on('click', function () {
		self.saveSchedule();
	});

}

function getUniqueScheduleId () {
	var id = global.scheduleIds[global.scheduleIds.length - 1]++;
	global.scheduleIds.push(id);
	return id;
}