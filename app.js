var express = require('express');
var app = express();
var db = require('./db');

// setup routers
var BookController = require('./Controllers/BookController')
app.use('/books', BookController)

module.exports = app;
