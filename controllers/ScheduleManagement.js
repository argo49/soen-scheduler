/**
This controller contains all the messaging done for ScheduleGenerator.
*/

var ScheduleGenerator = require("../models/ScheduleGenerator.js");

var count = 0;

//Idea to make controller is from Tim Roberts on his blog

/*ScheduleGenerator.GenerateSchedules(['SOEN 341', 'SOEN 331'], 4, null, function (error, schedules) {
	if (error) {
		console.log(error);
	}
	else {
		console.log('generated schedules');
		console.log(schedules);
	}
});*/

module.exports.controller = function(app) {

	/**
	Event to generate a list of possible schedules based on received data
	*/
	app.io.route("generateSchedules", function (req) {

		console.log('Received generation request');
		count++;
		console.log(count);

		ScheduleGenerator.GenerateSchedules(req.data.Courses, req.data.Session, req.data.Preferences, function (error, schedules) {
			if (error) {
				req.io.emit("generateSchedulesError", error);
				console.log(error);
			}
			else {
				req.io.emit("generateSchedules", schedules);
				console.log('////////////////////////////////');
				console.log(schedules);
				console.log('Schedules sent');
			}
		});

	});
}
