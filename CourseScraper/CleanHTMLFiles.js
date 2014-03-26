var fs = require('fs');
var cheerio = require('cheerio');

var fileNames = require('departments.json');    

fileNames.forEach(function (entry) {
		fs.readFile('ClassSchedules/' + entry + '.html', 'utf-8', function (error, data) {
			if (error != null) {
				console.log(error);
				throw error;
			}

			$ = cheerio.load(data);
			$('*').each(function() {      // iterate over all elements
				this[0].attribs = {};     // remove all attributes
			});
			
			var cleanedHTML = $.html().replace(/\<img\>/g, '').replace(/&.+\;/g, '').replace(/\<br\>/g, '').replace(/\<\/*b\>/g, '');
			fs.writeFile('ClassSchedules/'+ entry +'.xml', cleanedHTML, function (error) {
				if (error != null) {
					console.log(error);
					throw error;
				}
				console.log('done');
			});
		});
	});