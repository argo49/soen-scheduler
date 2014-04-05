var receiveCourses = require('getCourses.js');
var courseSessions = require('../../HTMLParsing/node_modules/courseList.json');


// var preferences = {};

// Quick export modules
// TODO add an error catcher in all the functions, try to add preferences
module.exports.GenerateSchedules = function (CourseList, Session, Preferences, Callback) {

	var schedules = {};

	if (verifySession(CourseList, Session)) {
		buildAllSections(CourseList, Session, function (error, sections) {
			makeCombinations(arrayToObject(sections, 'Course'), CourseList, function (error, combinations) {
				buildSchedules(combinations, arrayToObject(sections, 'Course'), function (error, ScheduleList) {
					removeConflicts(ScheduleList, function (error, Schedules) {
						Callback(null, Schedules);
					});
				});
			});
		});
	}
	else {
		var badCourse = verifySession(CourseList, Session);
		Callback('The course ' + badCourse + ' is currently not offered in the chosen session.', null);
	}
}

// Make all the sections combinations
function buildAllSections (courseList, session, callback) {

	var allSectionCombinations = [];
	var str = '';

	receiveCourses.getCourses(courseList, function (error, results) {
		if (error != null) {
			console.error(error);
			throw error;
		}

		
		// Loop through the returned courses
		for (var i = 0; i < results.length; i++) {

			for (course in results[i]) {
				if (course == '_id') continue;

				var arrLectures = JSON.stringify(results[i][course]).match(/(Lect|Sem|Studio|OnLine|Prac\/Int\/WTerm|UgradNSched|Conf)\s[0-9A-Z]+/g) == null ? [] : JSON.stringify(results[i][course]).match(/(Lect|Sem|Studio|OnLine|Prac\/Int\/WTerm|UgradNSched|Conf)\s[0-9A-Z]+/g);

				var temp = {};

				for (var l = 0; l < arrLectures.length; l++) {

					if (results[i][course][arrLectures[l]].Session != session) continue;

					var arrTutorials = JSON.stringify(results[i][course][arrLectures[l]]).match(/Tut\s[0-9A-Z]+/g) == null ? [] : JSON.stringify(results[i][course][arrLectures[l]]).match(/Tut\s[0-9A-Z]+/g);
					var arrLabs = JSON.stringify(results[i][course][arrLectures[l]]).match(/Lab\s[0-9A-Z]+/g) == null ? [] : JSON.stringify(results[i][course][arrLectures[l]]).match(/Lab\s[0-9A-Z]+/g);

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

					if (arrTutorials.length == 0 && arrLabs.length == 0) {
						temp.Id = temp.Course.replace(' ', '') + '.' + temp.Lecture.Section;
						str += JSON.stringify(temp, null, 4) + ',';
					}

					if (arrTutorials.length == 0  && arrLabs.length != 0) {
						var arr = arrTutorials;
						arrTutorials = arrLabs;
						arrLabs = arr;
					}
					
					for (var t = 0; t < arrTutorials.length; t++) {
						var property = 'Tutorial';

						// Switch the property if there were no tutorials but there were labs
						if (/Lab/.test(arrTutorials[t])) property = 'Lab';

						temp[property] = {
							Section : arrTutorials[t].split(' ')[1],
							Days : results[i][course][arrLectures[l]][arrTutorials[t]].Days,
							StartTime : results[i][course][arrLectures[l]][arrTutorials[t]]['Start Time'],
							EndTime : results[i][course][arrLectures[l]][arrTutorials[t]]['End Time'],
							Room : results[i][course][arrLectures[l]][arrTutorials[t]].Room
						}

						if (arrLabs.length == 0) {
							temp.Id = temp.Course.replace(' ', '') + '.' + temp.Lecture.Section + temp[property].Section;
							str += JSON.stringify(temp, null, 4) + ',';
						}

						for (var b = 0; b < arrLabs.length; b++) {
							temp.Lab = {
								Section : arrLabs[b].split(' ')[1],
								Days : results[i][course][arrLectures[l]][arrLabs[b]].Days,
								StartTime : results[i][course][arrLectures[l]][arrLabs[b]]['Start Time'],
								EndTime : results[i][course][arrLectures[l]][arrLabs[b]]['End Time'],
								Room : results[i][course][arrLectures[l]][arrLabs[b]].Room
							}
							temp.Id = temp.Course.replace(' ', '') + '.' +temp.Lecture.Section + temp.Tutorial.Section + temp.Lab.Section;
							str += JSON.stringify(temp, null, 4) + ',';
						};
					}


				}
			}
		};
		allSectionCombinations = JSON.parse('[' + str.substring(0, str.length - 1) + ']');
		callback(null, allSectionCombinations);
		return;
	});
}

// buildSchedules(makeCombinations(arrayToObject(allSectionCombinations, 'Course'), list),arrayToObject(allSectionCombinations, 'Course'));


function makeCombinations (ScheduleList, list, callback) {

	// console.log(JSON.stringify(ScheduleList, null, 4));

	var scheduleIds = [];

	// 1 course
	for (var A = 0; A < list.length; A++) {
	for (var a = 0; a < ScheduleList[list[A]].length; a++) {

		var strA = ScheduleList[list[A]][a].Id;

		if (list.length == 1) scheduleIds.push([strA].sort());

		// 2 courses
		for (var B = A+1; B < list.length; B++) {
		for (var b = 0; b < ScheduleList[list[B]].length; b++) {

			var strB = ScheduleList[list[B]][b].Id;

			if (list.length == 2) scheduleIds.push([strA,strB].sort());

			// 3 courses
			for (var C = B+1; C < list.length; C++) {
			for (var c = 0; c < ScheduleList[list[C]].length; c++) {

				var strC = ScheduleList[list[C]][c].Id;

				if (list.length == 3) scheduleIds.push([strA,strB,strC].sort());

				// 4 courses
				for (var D = C+1; D < list.length; D++) {
				for (var d = 0; d < ScheduleList[list[D]].length; d++) {

					var strD = ScheduleList[list[D]][d].Id;

					if (list.length == 4) scheduleIds.push([strA,strB,strC,strD].sort());

					// 5 courses
					for (var E = D+1; E < list.length; E++) {
					for (var e = 0; e < ScheduleList[list[E]].length; e++) {

						var strE = ScheduleList[list[E]][e].Id;

						if (list.length == 5) scheduleIds.push([strA,strB,strC,strD,strE].sort());

						// 6 courses	
						for (var F = E+1; F < list.length; F++) {
						for (var f = 0; f < ScheduleList[list[F]].length; f++) {

							var strF = ScheduleList[list[F]][f].Id;

							if (list.length == 6) scheduleIds.push([strA,strB,strC,strD,strE,strF].sort());

							// 7 courses
							for (var G = F+1; G < list.length; G++) {
							for (var g = 0; g < ScheduleList[list[G]].length; g++) {

								var strG = ScheduleList[list[G]][g].Id;

								if (list.length == 7) scheduleIds.push([strA,strB,strC,strD,strE,strF,strG].sort());

								// 8 courses
								for (var H = G+1; H < list.length; H++) {
								for (var h = 0; h < ScheduleList[list[H]].length; h++) {

									var strH = ScheduleList[list[H]][h].Id;

									if (list.length == 8) scheduleIds.push([strA,strB,strC,strD,strE,strF,strG,strH].sort());

									// 9 courses
									for (var I = H+1; I < list.length; I++) {
									for (var i = 0; i < ScheduleList[list[I]].length; i++) {

										var strI = ScheduleList[list[I]][i].Id;

										if (list.length == 9) scheduleIds.push([strA,strB,strC,strD,strE,strF,strG,strH,strI].sort());										
										
									}}							
								}}
							}}
						}}
					}}
				}}
			}}
		}}
	}}

	// console.log(scheduleIds);
	console.log('Number of combinations made: ' + scheduleIds.length);
	callback(null, scheduleIds);
	return;
	

}

// Constructs the schedules objects based on the array of courses-sections
function buildSchedules (ScheduleList, Schedule, callback) {

	var schedID = ''
	var schedule = {};
	var done = [];

	// Loop through the different Id's
	for (var m = 0; m < ScheduleList.length; m++) {

		schedID = createId(ScheduleList[m]);

		if (done.indexOf(schedID) != -1) continue;

		// Loop through the course section of the combination
		for (var s = 0; s < ScheduleList[m].length; s++) {

			var courseCode = ScheduleList[m][s].match(/.+\./)[0].replace('.','');
			courseCode = courseCode.substring(0,4) + ' ' + courseCode.substring(4,courseCode.length);
			// console.log(courseCode);

			for (var n = 0; n < Schedule[courseCode].length; n++) {

				if (Schedule[courseCode][n].Id == ScheduleList[m][s]) {
					if (schedule[schedID] == null) schedule[schedID] = [];
					schedule[schedID].push(Schedule[courseCode][n]);
				}
			}
		}
		done.push(schedID);
	}

	// console.log(schedule);
	callback(null, schedule);
	return;

}


// Goes through all the schedules and removes those with conflicts
function removeConflicts (ScheduleList, callback) {

	var conflict = false;
	var sharedDays = [];
	var tutorialA = false,
		tutorialB = false;
	var labA = false,
		labB = false;
	var goodSchedules = [];

	for (schedule in ScheduleList) {
		// schedule = COMP232SSA-COMP249SSA-...

		conflict = false;

		for(var a = 0; a < ScheduleList[schedule].length; a++) {
			// ScheduleList[schedule][i] = {Course: 'COMP 232', Lecture: [Object],...}
			var SectionA = ScheduleList[schedule][a];

			if (SectionA.Lecture == null) continue;

			tutorialA = (SectionA.Tutorial != null);
			labA = (SectionA.Lab != null);

			for (var b = a+1; b < ScheduleList[schedule].length; b++) {

				var SectionB = ScheduleList[schedule][b];

				if (SectionB.Lecture == null) continue;

				tutorialB = (SectionB.Tutorial != null);
				labB = (SectionB.Lab != null);

				// Lecture of A vs Lecture of B
				sharedDays = sameDays(SectionA.Lecture, SectionB.Lecture);

				if (sharedDays.length != 0) {
					conflict = conflict == true ? true : sameTime(SectionA.Lecture, SectionB.Lecture);
				}

				// Lecture of A vs Tutorial of B
				if (tutorialB) {
					sharedDays = sameDays(SectionA.Lecture, SectionB.Tutorial);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Lecture, SectionB.Tutorial);
					}
				}

				// Lecture of A vs Lab of B
				if (labB) {
					sharedDays = sameDays(SectionA.Lecture, SectionB.Lab);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Lecture, SectionB.Lab);
					}
				}

				// Tutorial of A vs Lecture of B
				if (tutorialA) {
					sharedDays = sameDays(SectionA.Tutorial, SectionB.Lecture);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Tutorial, SectionB.Lecture);
					}
				}

				// Tutorial of A vs Tutorial of B
				if (tutorialA && tutorialB) {
					sharedDays = sameDays(SectionA.Tutorial, SectionB.Tutorial);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Tutorial, SectionB.Tutorial);
					}
				}

				// Tutorial of A vs Lab of B
				if (tutorialA && labB) {
					sharedDays = sameDays(SectionA.Tutorial, SectionB.Lab);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Tutorial, SectionB.Lab);
					}
				}

				// Lab of A vs Lecture of B
				if (labA) {
					sharedDays = sameDays(SectionA.Lab, SectionB.Lecture);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Lab, SectionB.Lecture);
					}
				}

				// Lab of A vs Tutorial of B
				if (labA && tutorialB) {
					sharedDays = sameDays(SectionA.Lab, SectionB.Tutorial);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Lab, SectionB.Tutorial);
					}
				}

				// Lab of A vs Lab of B
				if (labA && labB) {
					sharedDays = sameDays(SectionA.Lab, SectionB.Lab);
					if (sharedDays.length != 0) {
						conflict = conflict == true ? true : sameTime(SectionA.Lab, SectionB.Lab);
					}
				}
			}
		}

		if (!conflict) {
			ScheduleList[schedule].Id = schedule;
			goodSchedules.push(ScheduleList[schedule]);
		}
	}

	console.log('Number of schedule combinations without conflict: ' + goodSchedules.length);
	callback(null, goodSchedules);
	return;

}

// Creates an Id for the schedule based on the courses and their sections
function createId (sectionIds) {

	var scheduleID = '';

	for (var i = 0; i < sectionIds.length; i++) {
		if (i == 0) scheduleID += sectionIds[i];
		else scheduleID += '-' + sectionIds[i];
	}

	return scheduleID.replace(/\./g, '');

}

function sameDays (schedA, schedB) {

	// console.log('A: '); console.log(schedA);
	// console.log('B: '); console.log(schedB);

	var daysA = schedA.Days.split(',');
	var daysB = schedB.Days.split(',');
	var shared = [];

	for (var i = 0; i < daysA.length; i++) {
		for (var j = 0; j < daysB.length; j++) {
			// return the day that they shar
			if (daysA[i] == daysB[j]) shared.push(daysA[i]);
		};
	};

	// Returns array of conflicting days
	return shared;
}

function sameTime (schedA, schedB) {

	// Returns true if a conflict is found for the sections given

	if ((schedB.StartTime >= schedA.StartTime && schedB.StartTime <= schedA.EndTime) || (schedB.EndTime >= schedA.StartTime && schedB.EndTime <= schedA.EndTime)) {

		return true;
	}

	else return false;

}

function arrayToObject (Array, Property) {
	// makes the array of all section into an object that separates them by course

	var Obj = {};

	for (var i = 0; i < Array.length; i++) {
		
		if (Obj[Array[i][Property]] == null) {
			Obj[Array[i][Property]] = [];
		}

		Obj[Array[i][Property]].push(Array[i]);
	};

	return Obj;
}

function verifySession (Courses, Session) {

	for (var i = 0; i < Courses.length; i++) {
		if (courseSessions[Courses[i]].indexOf(Session) == -1) return Courses[i];
	}

	return true;

}