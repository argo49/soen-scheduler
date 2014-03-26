var fs = require('fs'),
	xmljson = require('xmljson');

var to_json = xmljson.to_json;

var fileNames = require('departments.json');


fileNames.forEach(function (entry) {
	fs.readFile('ClassSchedules/' + entry + '.xml', 'utf-8', function (error, data) {
		if (error == null) {
			to_json(data, function (error, json) {
			    if (error) {
			    	throw error;
			    }
			    else {
				    fs.writeFile('node_modules/' + entry + '.json', JSON.stringify(json.table.tbody.tr, null, 4), function (error) {
				    	if (error)
				    		throw error;
				    	else
				    		console.log('done');
				    });
			    }
			});	
		}
		else {
			console.log('///////////////////// '+ entry);
			throw error;
		}
	});
});




