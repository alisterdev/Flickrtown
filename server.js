var express = require('express');
var morgan = require('morgan');
var consolidate = require('consolidate');
var config = require('konfig')();
var errorHandler = require('./utils').errorHandler;
var generateSlug = require('./utils').generateSlug;
var bodyParser = require('body-parser');

var fs = require('fs');
var path = require('path');
var routes = require('./routes');

var app = express();
app.set('env', 'dev');

//- DATABASE
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codewithme');

//- PRE-ROUTES
app.use(morgan('dev'));

// LOG
var log = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
app.use(morgan('combined', {
	stream: log
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


//- SETUP API ROUTE
var api = new express.Router();

var syncher = 1;
function doDone(){
	if(--syncher===0)
		done();
}
fs.readdir('./', function(err, files){
	syncher += files.length;
	
	files.forEach(function(file){
		var filePath = path.join(__dirname, file);
		fs.stat(filePath, function(err, stats){
			
			if(stats.isDirectory() && file.match(/^v[0-9]+$/i)){ //finds api versions folders (ei, v1, v2, v3)

				fs.readdir(filePath, function(err, files){ //reads all files in the api version
					var v = new express.Router(); //version router
					files.sort();
					files.forEach(function(file){
						if(path.extname(file) === '.js'){
							v.use('/' + path.basename(file, '.js'), require(path.join(filePath, file))); //add all routes to this version
						}
					});
					api.use('/'+file, v);
					doDone();
				});
			}else{
				doDone();
			}
		})
	});
	
	doDone();
});

function done() {
	//- ROUTES
	app.use('/api', api);
	app.use(routes);

	//- POST-ROUTES
	app.use(function(err, req, res, next){ //error catcher
		console.error(err.stack.toString().red);
		res.status(500).send('Oops. ' + err.message);
	});

	//start
	var server = app.listen(config.app.port, function(){
			console.log('Listening at http://%s:%s',
				server.address().address,
				server.address().port);
	});
}