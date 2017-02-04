/**
 * express to provide server and routing
 * ref:  http://expressjs.com/en/4x/api.html
 */
var express = require('express');

/**
 * path provides utilities for working with file and directory paths.
 * ref:  https://nodejs.org/api/path.html
 */
var path = require('path');

/**
 * File I/O is provided by simple wrappers around standard POSIX functions.
 * ref:  https://nodejs.org/api/fs.html#fs_file_system
 */

var app = express();

var logger = require('morgan');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var package = require("./package.json");

/**
 * Q to use promises
 * ref: http://documentup.com/kriskowal/q/
 */

/**
 * Morgan to log the server requests
 * ref: https://github.com/expressjs/morgan
 */
var morgan = require('morgan');


//create express app
var app = express();

/**
 * Custom modules require
 */
var Routes = require('./routes/routes');

var db = require('./helpers/db');

//port number 
var port = 3000;

//static content path
var publicContent = path.join(__dirname, 'views');

//use morgan to log requests to the server
app.use(morgan('tiny'));

// set the static file to serve
/**
 * __dirname : name of the directory that the currently executing script resides 
 * ref: https://nodejs.org/docs/latest/api/globals.html#globals_dirname
 */
app.use(express.static(publicContent));

app.use(logger('dev'));

app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.urlencoded({limit: '50mb',
    extended: true
}));

app.use(cookieParser());

db.init();

// use the routes defined in the routes folder
app.use('/', Routes); // all the routes defined in the Routes are attached to the root route

// listen port to start server
app.listen(port, function () {
    console.log("server is listening on 3000 ");
});