var express = require('express.io'),
    fs = require('fs');   

var app = express().http().io();

//Loading sessions
app.use(express.cookieParser());
app.use(express.session({secret: 'there_is_no_spoon'}));

//Start up controllers

//User management contains code for login/logout
var UserManagement = require('./controllers/UserManagement.js');
UserManagement.controller(app);

/**
Any page that requires the user logged in will check
*/
app.get('/home.html', function(req, res) {
	if(req.session.user)
		res.sendfile(__dirname + '/public/home.html');
	else
		res.sendfile(__dirname + '/public/index.html');
});
app.get('/profile.html', function(req, res) {
	if(req.session.user)
		res.sendfile(__dirname + '/public/profile.html');
	else
		res.sendfile(__dirname + '/public/index.html');
});

//Any page NOT covered by the above get requests will be served as normal
app.use(express.static(__dirname + '/public'));

//Starting of HTTP server
app.listen(80, function(){
	console.log('Server started on port 80.');
});

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
