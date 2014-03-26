var fs = require('fs');

// ["FineArts","ArtsAndScience","EngineeringAndComputerScience","JohnMolsonSchoolOfBusiness","SchoolOfExtendedLearning"]
var department = 'SchoolOfExtendedLearning';

var json = require(department + '.json');

// The maximum size for a lecture/seminar
var MAX_LECT = 100;
// The maximum size for the tutorial and lab sections
var MAX_TUT_LAB = 20;

var courseList = {};

for (n in json) {
	for (td in json[n]) {
		// Gets the course number
		if (json[n][td]['0'] == '') {

			courseList[json[n][td]['1']] = {
				'Title':json[n][td]['2'],
				'Credits':parseInt(json[n][td]['3'])
			};

			var i = 1;
			var str = '';
			courseList[json[n][td]['1']].info = '';

			while (json[(parseInt(n)+i).toString()] != null && json[(parseInt(n)+i).toString()]['td'] != null && json[(parseInt(n)+i).toString()]['td']['0'] == ' ') {
				for (entry in json[(parseInt(n)+i).toString()]['td']) {
					if (json[(parseInt(n)+i).toString()]['td'][entry] != ' ') courseList[json[n][td]['1']].info += json[(parseInt(n)+i).toString()]['td'][entry].toString().trim() + ' ';
				}
				i++;
				courseList[json[n][td]['1']].info += '\n';
			}
		}
	}
}

for (course in courseList) {
	for (info in courseList[course]) {

		if (info == 'info') {

			var str = courseList[course][info].split('\n');
			for (var i = 0; i < str.length; i++) {

				if (/Prerequisite/.test(courseList[course][info])){

					if (/[A-Z]{4}\s[A-Z0-9]{3}/.test(courseList[course][info].match(/Prerequisite\:(.+)/)[1])) {
						try {
						courseList[course]['Prerequisite'] = courseList[course][info].match(/Prerequisite\:(.+)/)[1].match(/[A-Z]{4}(\s)?[A-Z0-9]{3,4}/g).join();						
						}
						catch (e) {
							console.log(courseList[course][info]);
							throw e;
						}
					}
					else {
						courseList[course]['Prerequisite'] = courseList[course][info].match(/Prerequisite\:(.+)/)[1].trim();
					}
				}

				if (/Special\sNote/.test(courseList[course][info])){
				    courseList[course]['Special Note'] = courseList[course][info].match(/Special\sNote\:(.+)/)[1].trim();
				}

				if (/Summer\sTerm/.test(courseList[course][info])){
				    courseList[course]['Summer Term'] = courseList[course][info].match(/Summer\sTerm\:(.+)/)[1].match(/\d{1,2}\s\w+/g)[0] + '-' + courseList[course][info].match(/Summer\sTerm\:(.+)/)[1].match(/\d{1,2}\s\w+/g)[1];
				}

				if (/\/\d\s(Lect|Sem|Studio)/.test(str[i]) && !/Canceled/.test(str[i])) {

					var sectionCode = str[i].match(/(Lect|Sem|Studio)\s[A-Z0-9]{1,2}/g)[0];

					var session = !!str[i].match(/\/[1234]/) ? parseInt(str[i].match(/\/([1234])/)[1]) : 0,

						days = !!str[i].match(/\s[MTWJFSD-]{7}\s/) && !!str[i].match(/\s[MTWJFSD-]{7}\s/)[0].match(/\w/g) ? str[i].match(/\s[MTWJFSD-]{7}\s/)[0].match(/\w/g) : ['unknown'], 
						time = !!str[i].match(/\d{2}\:\d{2}\-\d{2}\:\d{2}/) ? str[i].match(/\d{2}\:\d{2}\-\d{2}\:\d{2}/)[0] : '00:00-00:00',
						startTime = time.split('-')[0],
						endTime  = time.split('-')[1],
						room = !!str[i].match(/(SGW|LOY)\s\w+\-[0-9A-Z\.]+/) ? str[i].match(/(SGW|LOY)\s\w+\-[0-9A-Z\.]+/)[0] : 'unknown',
						professor = !!str[i].match(/[A-Z-\s]+\,[A-Z-\s]+$/) ? str[i].match(/[A-Z-\s]+\,[A-Z-\s]+$/)[0] : 'unknown';

					courseList[course][sectionCode] = {
						'Session': session,
						'Days': days.join(),
						'Start Time': timeToDecimal(startTime),
						'End Time': timeToDecimal(endTime),
						'Room': room,
						'Professor': professor.trim(),
						'Size': MAX_LECT,
						'NbStudents': Math.floor(Math.random() * MAX_LECT)
					};

					var j = i + 1;

					while (/(Tut|Lab)\s[A-Z]{1,2}/.test(str[j]) && !/Canceled/.test(str[j])) {

						var tlCode = str[j].match(/(Tut|Lab)\s[A-Z0-9]{1,2}/g)[0];

						days = !!str[j].match(/\s[MTWJFSD-]{7}\s/) && !!str[j].match(/\s[MTWJFSD-]{7}\s/)[0].match(/\w/g) ? str[j].match(/\s[MTWJFSD-]{7}\s/)[0].match(/\w/g) : ['unknown'],
							time = !!str[j].match(/\d{2}\:\d{2}\-\d{2}\:\d{2}/) ? str[j].match(/\d{2}\:\d{2}\-\d{2}\:\d{2}/)[0] : '00:00-00:00',
							startTime = time.split('-')[0],
							endTime = time.split('-')[1],
							room = !!str[j].match(/(SGW|LOY)\s\w+\-[0-9A-Z\.]+/) ? str[j].match(/(SGW|LOY)\s\w+\-[0-9A-Z\.]+/)[0] : 'unknown';

						courseList[course][sectionCode][tlCode] = {
							'Days': days.join(),
							'Start Time': timeToDecimal(startTime),
							'End Time': timeToDecimal(endTime),
							'Room': room,
							'Size': MAX_TUT_LAB,
							'NbStudents': Math.floor(Math.random() * MAX_TUT_LAB)
						};
						j++;
					}
				}
			}
			delete courseList[course][info];
		}
	}
}

fs.writeFile('node_modules/FINAL_' + department + '.json', JSON.stringify(courseList, null, 4), function (error) {
	if (error)
		throw error;
	else
		console.log(department + ' DONE');
});


// Convert the time string into a float
function timeToDecimal (time) {
	var hour = parseInt(time.split(':')[0]);
	var minutes = parseInt(time.split(':')[1])/60;

	return Math.round(100 * (hour + minutes)) / 100;
}

