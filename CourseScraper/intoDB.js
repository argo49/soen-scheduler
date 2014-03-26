// For connecting to the MongoDB database
var MongoClient = require('mongodb').MongoClient;

// Counts number of courses to make sure have been put into mongo
var courseCounter = 0;
var complete = false;

var departments = require('departments.json');

MongoClient.connect('mongodb://127.0.0.1:27017/CourseDirectory', function (error, db) {
	if (error != null) {
		console.log(error.toString() + '1');
		throw error;
	}
	else {
		console.log('Connected...');
		var collection = db.collection('CourseDirectory');

		for (var i = 0; i < departments.length; i++) {

			var file = require('FINAL_' + departments[i] + '.json');

			for (course in file) {
				courseCounter++;

				var temp = {
					'_id':course
				};
				temp[course] = file[course];

				collection.insert(temp, {safe:true}, function (error, docs) {
					if (error != null) {
						 if (!complete) {
						 	console.log(error.toString() + '2');
							throw error;
						}
					}
				});
			}
		}

		collection.count(function (error, count) {
			if (courseCounter == count) {
				console.log('COMPLETE ' + count + ' ENTRIES');
				complete = true;
				console.log('Closing connection...');
				db.close();
			}
		});
	}
});

