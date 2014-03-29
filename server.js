var express = require('express.io'),
    fs = require('fs');   

var app = express().http().io();

//Loading sessions
app.use(express.cookieParser());
app.use(express.session({secret: 'there_is_no_spoon'}));

//Server static content
app.use(express.static(__dirname + '/'));

//Initial request handler with session setup for HTTPS
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

//Starting of HTTP server
app.listen(80, function(){
	console.log('Server started on port 80.');
});

var UserManagement = require('./controllers/UserManagement.js');
UserManagement.controller(app);


// HTTPS code, not being used because of certificate prices
/****
var options = {
       key: fs.readFileSync('key.pem'), 
       cert: fs.readFileSync('key-cert.pem')
   };

var apps = express().https(options).io();
// Redirects all HTTP to the same HTTPS URL
app.get('*', function(req, res) {
	res.redirect('https://54.200.54.188'+req.url);
	console.log(req.url.toString());
})
// Starting of HTTPS server
apps.listen(443, function() {
	console.log('Server started on port 443');
});
****/
