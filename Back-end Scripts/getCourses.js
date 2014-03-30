// The module exports the function

// MongoDB client to connect to the database
var MongoClient = require('mongodb').MongoClient;

// Should be received instead
var selectedCourses = [];

// The number of objects to be returned for the schedule generator
var counter = 0;

// Array of the objects to be returned
var returnCourses = [];

module.exports.getCourses = function (courseList, callback) {

	selectedCourses = courseList;
	counter = courseList.length;
	// Open the connection to the database
	MongoClient.connect('mongodb://127.0.0.1:27017/CourseDirectory', function (error, db) {

		if (error != null) {
			console.error(error);
			throw error;
		}

		var collection = db.collection('CourseDirectory');
		var course = '';
		
		for (var i = 0; i < selectedCourses.length; i++) {

			course = selectedCourses[i];

			// Get each course's entry from the databse via the _id
			collection.findOne({'_id':course}, function (error, doc) {

				if (error != null) {
					console.error(error);
					throw error;
				}
				else {
					if (doc != null) {
						returnCourses.push(doc);
					}
					else { // Null doc means that it doesn't exist, so we decrement the counter
						counter--;
					}
				}

				if (returnCourses.length == counter) {
					callback(null, returnCourses);
					db.close();
					return;
				}
			});
		}
	});
}