// Popup for edit button
$(document).ready(function() {
	// State for editing fields
	var editMode = false;

	// Edit fields icon
	var editPencil = $('i.circular.pencil');

	// Turn div into input for editing and pencil to check
	editPencil.on('click', function() {
		var icon = $(this);
		
		if (editMode) {
			// Show that the data is being saved
			icon.css({color:'green', backgroundColor:'#C3FFD2'});

			// Replace inputs with divs containing those values
			var inputs = $('.attribute input');
			inputs.each(function() {
				var input     = $(this);
				var value     = input.val();
				var container = input.closest('.column');
				input.parent().remove();
				container.append($('<div/>').text(value));
				// Send data to server and on return, do the timeout thing
			});

			// Once it is sucessfully saved, go back to pencil icon
			window.setTimeout(function() {
				icon.removeClass('checkmark').addClass('pencil').attr('style','');
				// If the user clicks again during this interval, strange things
				// can happen, but it all gets reset in the end anyway so its not a big deal	
			}, 1200);

			// Set edit mode to false
			editMode = false;
		} else {

			// Change icon to checkmark
			icon.removeClass('pencil').addClass('checkmark');

			// Set edit mode to true
			editMode = true;	

			// Grab the attribute values and put them into inputs
			var fields = $('.attribute .column div');
			fields.each(function() {
				var field     = $(this);
				var container = field.parent();
				var input     = $('<div/>').addClass('ui small input');
				input.append($('<input type="text"/>').val(field.text()));
				field.remove();
				container.append(input);
			});
		}		
	}); // End pencil click

	var addCourse = $('.plus.icon');

	addCourse.on('click', function(){
		var plus = $(this);
		var list = plus.closest('.list');
		var input = 
			$('<div/>').addClass("item")
			.append($('<div class="ui action input"/>')
				.append($('<input type="text" placeholder="Enter course here..."/>'))
				.append($('<div/>').addClass('ui button black').text('Add')));

		// when you click the add button!
		input.find('.button').on('click', function(){
			var button = $(this);
			// check if it's an actual class and retrive the course name
			var container = input;
			
			container.append($('<a/>').addClass('header').text(container.find('input').val()));
			container.append($('<div/>').addClass('description').text('This is Totally a Class 101'));
			container.children().remove(':not(.header,.description)');

		});

		input.insertBefore(plus.parent());


	});

	// Set up accordion
	$('.ui.accordion').accordion();

	
});