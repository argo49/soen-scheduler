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
	scheduleIds: [0],
	schedules: []
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
	var s1 = new ScheduleManager({title:'asdasd'});
	var s2 = new ScheduleManager({title:'asdasd'});
	var s3 = new ScheduleManager({title:'asdasd'});
	var s4 = new ScheduleManager({title:'asdasd'});
	var s5 = new ScheduleManager({title:'asdasd'});
	var s6 = new ScheduleManager({title:'asdasd'});
	s1.insert();
	s2.insert();
	s3.insert();
	s4.insert();
	s5.insert();
	s6.insert();


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
			if (global.courses.length > 0) { 
				$('.prompt').fadeOut();
				// do server smthg
			}
		});

		this.accordion.accordion();
		this.dropdown.dropdown();

		if (typeof callback === "function") {
			callback();
		}
	}

	this.logout = function () {
		socket.emit('logout', function (data) {
			console.log();
		});
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

	this.init = function() {
		this.container.find('.title').text(this.title);
	}

	this.insert = function () {
		this.init();
		this.container.insertBefore($('.schedBottom'));
	}

	this.print = function () {

		// Hide all schedules and sidebar
		$('.sidebar').sidebar('hide');
		$.each(global.schedules, function (idx, sched) {
			sched.hide();
		});

		// show this schedule
		this.show();

		// Print
		window.print();
		
		// Show all schedules again
		$.each(global.schedules, function (idx, sched) {
			sched.show();
		});
	}

	this.newScheduleHandle = function () {
		var schedule = $('.row.schedule:first').clone(true, true);
		schedule.find('td').removeClass();
		schedule.find('.semester').add('.title').text("");
		return schedule;
	}

	this.hide = function () {
		this.container.hide();
	}

	this.show = function () {
		this.container.show();
	}

	// Horrible mess :)
	this.download = function () {

		var doc = new jsPDF('p','pt', 'a4', true);
        var source = $('table').first().get(0);

		var leftX   = 50;
		var rightX  = 550;
		var topY    = 50;
		var bottomY = 815;
		var numOfRows = this.container.find('tr').length;

		var cellHeight = 15;
		var offset = 0;
        
        doc.setLineWidth(0.5);

        // blue background header
        doc.setFillColor(212, 220, 232);
		doc.rect(leftX, topY, (rightX - leftX), cellHeight, 'F');

        //draw box
        doc.line(leftX,topY,leftX,bottomY);
        doc.line(rightX,bottomY,rightX,topY);
        doc.line(rightX,topY,leftX,topY);

        // Add rows
        for (var i = 0; i < numOfRows+2; i++) {
        	doc.line(leftX, topY + offset, rightX, topY + offset);
        	offset += cellHeight;
        }

        // Time column
        doc.line(leftX+50,topY,leftX+50,bottomY);

        //Other columns
        for (var i = 1; i < 6; i++) {
        	doc.line(leftX+50+(90*i),topY,leftX+50+(90*i),bottomY);
        }

        doc.setFont("helvetica");
        doc.setFontSize(10);

        // Add headers
        doc.text(leftX+5, topY+cellHeight-3, "TIME");
        doc.text(leftX+55, topY+cellHeight-3, "MONDAY");

        var textBase = leftX + 55;
        var textOffset = 90;

        doc.text(leftX+145, topY+cellHeight-3, "TUESDAY");
        doc.text(leftX+235, topY+cellHeight-3, "WEDNESDAY");
        doc.text(leftX+325, topY+cellHeight-3, "THURSDAY");
        doc.text(leftX+415, topY+cellHeight-3, "FRIDAY");

        var baseTime = 8.75, timeOffset = 0;
        var baseTimeX = leftX + 5, baseTimeY = topY + cellHeight - 3;

		for (var i = 0; i < numOfRows; i++){
			var mins = String(60 * ((baseTime + timeOffset) % 1));
			if (mins == 0) { mins += "0" } 
			var time = Math.floor(baseTime + timeOffset) + ":" + mins;
			timeOffset += 0.25;
			baseTimeY += cellHeight;
			doc.text(baseTimeX, baseTimeY, time);
		};

        doc.save('schedule.pdf');
	}

	this.tableToJSON = function () {
		var table = this.container.find('table')[0];
	    var data = [];


	    // first row needs to be headers
	    var headers = [];
	    for (var i=0; i<table.rows[0].cells.length; i++) {
	        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
	    }


	    // go through cells
	    for (var i=0; i<table.rows.length; i++) {

	        var tableRow = table.rows[i];
	        var rowData = {};

	        for (var j=0; j<tableRow.cells.length; j++) {

	            rowData[ headers[j] ] = tableRow.cells[j].innerHTML;

	        }

	        data.push(rowData);
	    }       

	    return data;

	}

	this.deleteSchedule = function () {

		if (!this.isSaved) {
			this.container.fadeOut(400, function () {
				self.container.remove();
				if ($('.row.schedule').length == 0) {
					var prompt = $('.prompt');
					prompt.fadeIn();
					prompt.find('h2').text("you haven't selected any courses yet!");
					prompt.find('p').text('the calendar icon to get started');
				}
			});
			
			

			
		} else {
			if (confirm('Are you sure you want to delete this saved schedule?')) {
				this.container.fadeOut(400, this.container.remove);

				// do server things to unsave
			} else {
				// do nothing
			}
		}
		
	}

	this.save = function () {
		this.saveIcon.css("background-color", "#C3FFD2");
		this.isSaved = true;
		// server things
	}
	
	this.id = (settings)? settings.id : getUniqueScheduleId();
	this.title = (settings)? settings.title : "";
	this.container = generateScheduleHandle().clone(true, true);
	this.saveIcon = this.container.find('.icon.save');
	this.closeIcon = this.container.find('.icon.close');
	this.printIcon = this.container.find('.icon.print');
	this.downloadIcon = this.container.find('.icon.download');
	this.isSaved = false;

	this.closeIcon.on('click', function () {
		self.deleteSchedule();
	});

	this.saveIcon.on('click', function () {
		self.save();
	});

	this.printIcon.on('click', function () {
		self.print();
	});

	this.downloadIcon.on('click', function () {
		self.download();
	});

	global.schedules.push(this);

}

function getUniqueScheduleId () {
	var id = global.scheduleIds[global.scheduleIds.length - 1]++;
	global.scheduleIds.push(id);
	return id;
}





function generateScheduleHandle () {

	var column = $('<div/>').addClass('column full');

	

	var icons = $('<div/>').addClass('icons')
		.append($('<h3/>').addClass('title'))
		.append($('<i/>').addClass('ui circular save icon'))
		.append($('<i/>').addClass('ui circular download icon'))
		.append($('<i/>').addClass('ui circular print icon'))
		.append($('<i/>').addClass('ui circular close icon'))
		.append($('<h3/>').addClass('semester'));

	column.append(icons);

	var table = $('<table/>')
		.addClass('schedule')
		.append($('<thead/>').append(getTableRow(5).find('td').addClass('day')))
		.append($('<tbody/>'));

	for (var i = 0; i < 50; i ++) {
		table.find('tbody').append(getTableRow(5));
	}

	column.append(table);


	function getTableRow(days) {
		var tr = $('<tr/>');

		for (var i = 0; i < days+1; i++) {
			tr.append($('<td/>'));
		}

		return tr;
	}

	column.append($('<div/>').addClass('ui horizontal divider'));

	var row = $('<div/>')
		.addClass('row clearfix schedule')
		.append(column);
	
	fillTimes(row);

	return row;

}

// quick n dirty
function fillTimes(scheduleHandle) {
	var baseTime = 8.75, offset = 0;
	var trs = scheduleHandle.find('tbody tr');
	$.each(trs, function (idx, ele) {
		var td = $(ele).find('td').first();
		var mins = String(60 * ((baseTime + offset) % 1));
		if (mins == 0) { mins += "0" } 
		var time = 
		td.text("" + Math.floor(baseTime + offset) + ":" + mins);
		offset += 0.25;
	});
}