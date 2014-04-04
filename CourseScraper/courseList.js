// This file is to create an array of all the courses and the sessions they are offered in
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var courseSession = {};

MongoClient.connect('mongodb://127.0.0.1:27017/CourseDirectory', function (error, db) {
	if (error != null) {
		console.log(error.toString() + '1');
		throw error;
	}
	var collection = db.collection('CourseDirectory');

	collection.find().toArray(function(err, results) {
		for (var i = 0; i < results.length; i++) {

    		courseSession[results[i]._id] = [];
	        
	        for (Lecture in results[i][results[i]._id]) {
	        	if (/Lect|Sem|Studio|OnLine|Prac\/Int\/WTerm|UgradNSched/.test(Lecture)) {
	        		if (courseSession[results[i]._id].indexOf(results[i][results[i]._id][Lecture].Session) == -1)
	        			courseSession[results[i]._id].push(results[i][results[i]._id][Lecture].Session);
	        	}
	        }
		};

		fs.writeFile('node_modules/courseList.json', JSON.stringify(courseSession, null, 4), function (error) {
			if (error)
				throw error;
			else
				console.log('DONE');
		});
        db.close();
    });
});