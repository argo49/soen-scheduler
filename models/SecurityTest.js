/**
Examples of how to use security module.
*/


//Import the module.
var security = require("./security.js");

//Then use its functions by using callbacks.

//Put array of random stuff in the database. This also works for single objects.
security.insert("users", "argonauts", [{"name":"Loras", "house":"Tyrell"}, {"name":"Gregor", "house":"Clegane"}], function(err, success) {
	if(err) throw err;
	console.log("We inserted Loras and Gregor in the database: " + success);

	//Check how many objects in the database are in house Tyrell
	security.find("users", "argonauts", {"house":"Tyrell"}, function(err, results) {
		if(err) throw err;
		console.log("How many objects belong to House Tyrell?: " + JSON.stringify(results));

		//Update Gregor's data to be Sandor instead
		//There are MANY options that can be used for this, but {"safe":"true"} should generally be kept
		security.update("users", "argonauts",{"name":"Gregor"}, {"name":"Sandor"}, {"safe":"true"}, function(err, success) {
			if(err) throw err;
			console.log("We changed Gregor's name to Sandor: " + success);

			//Check all entries in the database whatever is in the database
			security.find("users", "argonauts", {}, function(err, results) {
				if(err) throw err;
				console.log("All entries in database at this point: " + JSON.stringify(results));

				//Remove Sandor from the database
				security.remove("users", "argonauts", {"name":"Sandor"}, function(err, success) {
					if(err) throw err;
					console.log("We removed Sandor: " + success);

					//Remove Loras from database
					security.remove("users", "argonauts", {"name":"Loras"}, function(err, success) {
						if(err) throw err;
						console.log("Done!" + success);
					});
				});
			});
			
		});
		
	});
});


