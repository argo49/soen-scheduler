// Require the getCourses frunction from the other file
var receiveCourses = require('getCourses.js');

// For testing: a list of courses, this will normally come from the user
var list = ['ENGR 201','ENGR 202','ELEC 275', 'SOEN 287', 'COMP 232', 'COMP 249'];

// The session that the courses are to be looked for
var session = 2;

// Preferences to be taken into account
var preferences = {};

// An array to hold all lecture/tutorial/lab combinations for each course
var allSectionCombinations = [];
// String that will hold the JSON
var str = '';

// Get the courses listed
receiveCourses.getCourses(list, function (error, results) {
	// Check for errors
	if (error != null) {
		console.error(error);
		throw error;
	}

	
	// Loop through the returned course entries
	for (var i = 0; i < results.length; i++) {

		// We need to access the course information
		for (course in results[i]) {

			// Ignore the _id property
			if (course == '_id') continue;

			// Get an array of the Lecture sections to access them directly later
			var arrLectures = JSON.stringify(results[i][course]).match(/(Lect|Sem|Studio|OnLine|Prac\/Int\/WTerm|UgradNSched|Conf)\s[0-9A-Z]+/g) == null ? [] : JSON.stringify(results[i][course]).match(/(Lect|Sem|Studio|OnLine|Prac\/Int\/WTerm|UgradNSched|Conf)\s[0-9A-Z]+/g);

			// Temporary object that will be added to the whole string str
			var temp = {};

			// Loop through the lectures
			for (var l = 0; l < arrLectures.length; l++) {

				// If the session does not match for this lecture, skip to the next one
				if (results[i][course][arrLectures[l]].Session != session) continue;

				// Get an array of the tutorials and labs, an empty array is returned if there are none
				var arrTutorials = JSON.stringify(results[i][course][arrLectures[l]]).match(/Tut\s[0-9A-Z]+/g) == null ? [] : JSON.stringify(results[i][course][arrLectures[l]]).match(/Tut\s[0-9A-Z]+/g);
				var arrLabs = JSON.stringify(results[i][course][arrLectures[l]]).match(/Lab\s[0-9A-Z]+/g) == null ? [] : JSON.stringify(results[i][course][arrLectures[l]]).match(/Tut\s[0-9A-Z]+/g);

				// Start constructing the temp object
				temp = {
					Course : course,
					Lecture : {
						Section : arrLectures[l].split(' ')[1],
						Days : results[i][course][arrLectures[l]].Days,
						StartTime : results[i][course][arrLectures[l]]['Start Time'],
						EndTime : results[i][course][arrLectures[l]]['End Time'],
						Room : results[i][course][arrLectures[l]].Room,
						Professor : results[i][course][arrLectures[l]].Professor
					}
				};

				// If there are no tutorials or labs, add temp immediately to str
				if (arrTutorials.length == 0 && arrLabs.length == 0) str += JSON.stringify(temp, null, 4) + ',';

				// If the course has labs but not tutorials, we switch them so that the first loop will run
				if (arrTutorials.length == 0  && arrLabs.length != 0) {
					var arr = arrTutorials;
					arrTutorials = arrLabs;
					arrLabs = arr;
				}
				

				// loop through the tutorials
				for (var t = 0; t < arrTutorials.length; t++) {

					var property = 'Tutorial';

					// Switch the property if there were no tutorials but there were labs
					if (/Lab/.test(arrTutorials[t])) property = Lab;

					temp[property] = {
						Section : arrTutorials[t].split(' ')[1],
						Days : results[i][course][arrLectures[l]][arrTutorials[t]].Days,
						StartTime : results[i][course][arrLectures[l]][arrTutorials[t]]['Start Time'],
						EndTime : results[i][course][arrLectures[l]][arrTutorials[t]]['End Time'],
						Room : results[i][course][arrLectures[l]][arrTutorials[t]].Room
					}

					// If there are no labs, append temp to str
					if (arrLabs.length == 0) str += JSON.stringify(temp, null, 4) + ',';

					// Loop will not run for [] array
					for (var b = 0; b < arrLabs.length; b++) {
						temp.Lab = {
							Section : arrLabs[b].split(' ')[1],
							Days : results[i][course][arrLectures[l]][arrLabs[b]].Days,
							StartTime : results[i][course][arrLectures[l]][arrLabs[b]]['Start Time'],
							EndTime : results[i][course][arrLectures[l]][arrLabs[b]]['End Time'],
							Room : results[i][course][arrLectures[l]][arrLabs[b]].Room
						}
						// Append temp at the end of each loop cycle
						str += JSON.stringify(temp, null, 4) + ',';
					};
				}
			}
		}
	};
	allSectionCombinations = JSON.parse('[' + str.substring(0, str.length - 1) + ']');
	// checkConflicts(allSectionCombinations);

});

function checkConflicts (Schedule) {

	var sched = [];

	for (var a = 0; a < Schedule.length; a++) {

		for (var b = 0; b < Schedule.length; b++) {

			if (Schedule[a].Course != Schedule[b].Course) {

				// Both courses have lectures
				if (Schedule[a].Lecture != null && Schedule[b].Lecture != null) {
					
					//Check if the Lectures conflict
					if ((Schedule[a].Lecture.StartTime >= Schedule[b].Lecture.StartTime && Schedule[a].Lecture.StartTime <= Schedule[b].Lecture.EndTime) || (Schedule[a].Lecture.EndTime >= Schedule[b].Lecture.StartTime && Schedule[a].Lecture.EndTime <= Schedule[b].Lecture.EndTime)) {

					}
				}
			}
		};
	};
}
