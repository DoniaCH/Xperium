/**
 * Node.js server mail class
 */

var apisense = require('apisense');
var RidesAdapter = require('rides_adapter');

/*
 * Running server
 */
var express = require('express');
var app = express();

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.urlencoded()); 							// pull information from html in POST
	app.use(express.json());
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
})

/*
 *
 * JSON API
 *
 */
/**
 * Return all users ID in JSON format
 */
.get('/api/users', function(req, res) {
	apisense.query('users.js', {}, function (err, resp, data) {
        if (err) {
        	console.log("error :" + err);
            return;
        }

        data = JSON.parse(data);
        
        if(data) { 
	        res.json(data);  
        }
    });
})

/**
 * Return all user's rides for a given date in JSON format
 */
.get('/api/:min/:max', function(req, res) {
	var min = req.params.min;
	var max = req.params.max;

	apisense.query('rides.js', {min: min, max: max}, function (err, resp, data) {
        if (err) {
        	console.log("error :" + err);
            return;
        }

        data = JSON.parse(data);
		
        if(data.length > 0) {
        	var adapter = new RidesAdapter(data, min, max);
        	var rides = adapter.computeRides();
         /*return the  rides in json format  */
	        res.json(rides);
        }
    });
})

/*
 *
 * AngularJS Frontend
 *
 */
.get('/', function(req, res) {
    res.sendfile('public/app.html');
})

/**
 * 404 Error page
 */
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page not found !');
});


app.listen(process.env.PORT || 9000);
console.log("App listening on port 9000");
