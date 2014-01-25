$(document).ready(function() {
	var tag           = $('.tag');
	var addInput      = $('.sidebar input');
	var addCourseIcon = addInput.siblings('i');
	var courseList    = $('div#courseList');
	var sidebarActive = false;
	var dropdowns     = $('.ui.dropdown');

	dropdowns.dropdown();

	tag.on('click', function(){
		var courseSidebar = $('.ui.sidebar');
		var icon = tag.children().first();

		courseSidebar.sidebar('toggle');
		sidebarActive = !sidebarActive;

		if (sidebarActive) {
			icon.removeClass('add').addClass('reply mail');
		} else {
			icon.removeClass('reply mail').addClass('add');
		}
	});

	tag.on('mouseenter', function(){
		if (!sidebarActive) {
			var that = $(this);
			that.stop();
			that.animate({width:"12em"}, 300, function(){
				that.children().last().show();
			});
		}
	});

	tag.on('mouseleave', function(){
		var that = $(this);
		that.stop();
		that.children().last().hide();
		that.animate({width:"2.7em"}, 300);
	});

	addInput.autocomplete({
		// Need to get an array of courses from server on page load
		source: ['SOEN 331', 'SOEN 341', 'ELEC 275', 'ENGR 371', 'COMP 346'],
		delay: 0
	});

	addInput.on('keyup', function(e) {
		// User presses enter = 13
		if (e.which == "13") {
			addCourseToList($(this).val().toUpperCase());
		}
	});

	addCourseIcon.on('click', function(){
		addCourseToList(addInput.val());
	});

	function addCourseToList(courseName) {
		// Should verify that courseName entered is a valid course before adding it to the list

		if (!courseName) {
			// p
		} else {
			var course = $('<div/>')
			.addClass('course')
			.text(courseName)
			.append($('<div/>')
				.addClass('ui color circle')
				.css('backgroundColor', _colors[courseList.children().length]))
			.append($('<div/>')
				.addClass('ui black icon button removeCourse')
				.append($('<i/>')
					.addClass('remove icon')))

			course.find('.removeCourse').on('click', function(){
				$(this).parent().remove();
			});

			// You can only take 6 courses at a time, right?
			if (courseList.children().length < 6) {
				courseList.append(course);
			} else {

			}
		}
		
	}

	function removeCourseFromList(courseElement) {
		courseElement.remove();
	}

	var _colors = [
		"#f56545",
		"#ffbb22",
		"#eeee6d",
		"#bbe535",
		"#77ddbb",
		"#66ccdd"
	];

	// slice makes a value-cloned copy, weird right?
	var _availableColors = _colors.slice();
});





// my concordia code

//***************************************************
//	Cookie functions
//	Source: http://www.quirksmode.org/js/cookies.html
//**************************************************
function setCookie(name, value, days) {
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = ";expires="+date.toGMTString();
	}
	else
	{
		var expires = "";
	}
	document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	
	for(var i=0; i < ca.length; i++)
	{
		var c = ca[i];
		
		while (c.charAt(0) == ' ')
		{
			c = c.substring(1, c.length);
		}
		
		if (c.indexOf(nameEQ) == 0)
		{
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}
function eraseCookie(name) {
	setCookie(name,"",-1);
}

/*
 * Portal functions
 */
function trim (str, charlist) {
    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist) {
        // Default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

// Main onload fUnction
$(function(){

	$('#userid').trigger('focus');

	// **************************************
	// SEARCH
	// Don't submit if the search term doesn't exist
	$('#search_form').submit(function() {
		var $search_term = $('#search_term').val();
		if ($search_term == '' || $search_term.toLowerCase() == 'search') {
			return false;	
		}
	});
	
	// **************************************
	//  TABS
	// default to first tab
	var event_tab = readCookie('event_tab');
	
	if (event_tab == 2) {
		set_tab_2();
	}
	else {
		set_tab_1();
	}
	
	$('#tab_control_1 a').bind('click', function(e) {
		e.preventDefault();
		setCookie('event_tab', 1, 365);	
		set_tab_1();				
	});
	$('#tab_control_2 a').bind('click', function(e) {
		e.preventDefault();
		setCookie('event_tab', 2, 365);
		set_tab_2();					
	});

	function set_tab_1()
	{
		$('#tab_1').show();
		$('#tab_2').hide();
		$('#tab_control_1').addClass('selected');
		$('#tab_control_2').removeClass('selected');
	}
	function set_tab_2()
	{
		$('#tab_1').hide();
		$('#tab_2').show();
		$('#tab_control_1').removeClass('selected');
		$('#tab_control_2').addClass('selected');	
	}
	
	$("#help_wrapper").hide();
});
