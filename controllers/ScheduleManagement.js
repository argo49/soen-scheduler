/**
This controller contains all the messaging done for ScheduleGenerator.
*/

var ScheduleGenerator = require("../models/ScheduleGenerator.js");

//Idea to make controller is from Tim Roberts on his blog

module.exports.controller = function(app) {

	/**
	Event to generate a list of possible schedules based on received data
	*/
	app.io.route("generateSchedules", function (req) {

		ScheduleGenerator.GenerateSchedules(req.data.Courses, req.data.Session, req.data.Preferences, function (error, schedules) {
			if (error) {
				req.io.emit("generateSchedulesError", error);
				console.log(error);
			}
			else {
				req.io.emit("generateSchedules", schedules);
			}
		});

	});
}
