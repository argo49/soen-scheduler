/**
Simple module to use common commands on the MongoDB database. All the functions take callbacks as their last parameter. Every callback should check the first parameter, which is an error/exception.
*/

var MongoClient = require('mongodb').MongoClient;

/**
Finds the entries in the database that correspond to the criteria entered.
*/
exports.find = function (nameOfDatabase, nameOfCollection, criteria, callback) {

	MongoClient.connect('mongodb://127.0.0.1:27017/' + nameOfDatabase, function(err, db) {
		if(err) {
			callback(err);
			return;
		}

		else  {
			var collection = db.collection(nameOfCollection);
			collection.find(criteria).toArray(function(err, results) {
				db.close();
				callback(err, results);
			});
		}
	});
}

/**
Inserts an object (or an array of objects) into a specified database + collection.
Be careful: The object's validity is not checked!
*/
exports.insert = function(nameOfDatabase, nameOfCollection, object, callback) {
	MongoClient.connect('mongodb://127.0.0.1:27017/' + nameOfDatabase, function(err, db) {
		if(err) {
			callback(err);
			return;
		}

		else {
			var collection = db.collection(nameOfCollection);

			collection.insert(object, function(err, docs) {
				db.close();
				if(err)
					callback(err);
				else
					callback(err, true);
			});
		}
	});
}

/**
Updates an object corresponding to the criteria with the data put in object. Other properties of the targeted object are unaffected.
This also allows us to use options for the updating in MongoDB.
*/
exports.update = function(nameOfDatabase, nameOfCollection, criteria, object, options, callback) {
	MongoClient.connect('mongodb://127.0.0.1:27017/' + nameOfDatabase, function(err, db) {
		if(err) {
			callback(err);
			return;
		}

		else {
			var collection = db.collection(nameOfCollection);

			collection.update(criteria, {$set:object}, options, function(err, docs) {
				db.close();
				if(err)
					callback(err);
				else
					callback(err, true);
			});
		}
	});
}

/**
Removes objects that correspond to a specific criteria.
I make it fail if the criteria is empty, since that would erase the whole database.
*/
exports.remove = function(nameOfDatabase, nameOfCollection, criteria, callback) {

	try {
		isEmpty(criteria, function(empty) {
	
			if(empty) {
				throw "remove() needs a non-empty object as criteria";
				return;
			}

			else {
				MongoClient.connect('mongodb://127.0.0.1:27017/' + nameOfDatabase, function(err, db) {
					if(err) {
						callback(err);
						return;
					}

					var collection = db.collection(nameOfCollection);

					collection.remove(criteria, function(err, docs) {
						db.close();
						if(err)
							callback(err);
						else
							callback(err, true);
					});
				});
			}
	
		});
	
	} catch(exception) {
		callback(exception);
	}
}

/**
Unrelated function that verifies if an object has no properties.
Returns false if an object has at least one property, true otherwise.
*/
function isEmpty(obj, callback) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			callback(false);
			return;
		}
	}
	callback(true);
}
