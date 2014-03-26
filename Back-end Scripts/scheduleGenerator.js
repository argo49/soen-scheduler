var receiveCourses = require('getCourses.js');

var list = ['ENGR 201','ENGR 202','COMP 232', 'HIII 456'];

var Obj = {};
var temp = {};

// Course Code: 				Obj[index]._id
// Lectures are in: 			Obj[i][Obj[i]._id]
// Tutorials are in: 			Obj[i][Obj[i]._id][lecture] 

/**
Course:...
Lect:... section/times/room/prof
Tut:...	 section/times/room
**/	

var temp = {
	Course: null,
	Lecture: null,
	Tutorial: null
};

receiveCourses.getCourses(list, function (error, results) {
	if (error != null) {
		console.error(error);
		throw error;
	}
	Obj = results;
	
	for (var i = 0; i < Obj.length; i++) {

		if (temp.Course == null) temp.Course = Obj[i]._id;

		for (lecture in Obj[i][Obj[i]._id]) {
			if (/Lect|Sem|Studio/.test(lecture.toString())) {

				if (temp.Lecture == null) {
					temp.Lecture = {
						'Section' = lecture,
						'Days' = Obj[i][Obj[i]._id][lecture].Days,
						'Start Time' = Obj[i][Obj[i]._id][lecture]['Start Time'],
						'End Time' = Obj[i][Obj[i]._id][lecture]['End Time'],
						'Room' = Obj[i][Obj[i]._id][lecture].Room,
						'Professor' = Obj[i][Obj[i]._id][lecture].Professor,
						'isFull' = (Obj[i][Obj[i]._id][lecture].Size == Obj[i][Obj[i]._id][lecture].NbStudents)
					}
				};

				console.log(temp);

				for (tutlab in Obj[i][Obj[i]._id][lecture]) {
					if (/Tut|Lab/.test(tutlab.toString())) {
						// console.log(tutlab);
					}
				}
			}
		}
	};
});
