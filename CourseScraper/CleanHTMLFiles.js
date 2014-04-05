var fs = require('fs');
var cheerio = require('cheerio');

var fileNames = require('departments.json'); 

fileNames.forEach(function (entry) {
		fs.readFile('ClassSchedules/' + entry + '.html', 'utf-8', function (error, data) {
			if (error != null) {
				console.log(error);
				throw error;
			}

			// Load the entire HTML Page
			$ = cheerio.load(data);

			// Create a new table HTML object to place the table schedule into
			var table = cheerio.load('<table></table>');

			// Append the schedule tbody to this rempty table
			table('table').append($('#ctl00_PageBody_tblBodyShow1').html());

			// Load the table that was made
			$ = cheerio.load(table.html());
			
			// Remove all the attributes of each tag
			$('*').each(function() {      // iterate over all elements
				this[0].attribs = {};     // remove all attributes
			});

			// Remove all the <img>, <b>, </b>, and <br> tags
			$('img,br,b').each(function() {
				this.remove();
			});

			var cleanedHTML = $.html();
			fs.writeFile('ClassSchedules/'+ entry +'.xml', cleanedHTML, function (error) {
				if (error != null) {
					console.log(error);
					throw error;
				}
				console.log('done');
			});
		});
	});