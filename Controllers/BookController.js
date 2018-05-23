var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Book = require('../Models/Book');

// Create a new book
router.post('/', function(req, res) {
  Book.create(
    {
      name: req.body.name,
      author: req.body.author
    },
    function(err, book) {
      if (err)
        return res
          .status(500)
          .send('There was a problem adding the information to the database.');
      res
        .status(200)
        .send(book);
    }
  );
});

// Get all books in the database
router.get('/', function(req, res) {
  Book.find({}, function(err, books) {
    if (err)
      return res
        .status(500)
        .send('There was a problem adding the information to the database.');
    res
        .status(200)    
        .send(books);
  });
});

// get a single book from the database
router.get('/:id', function(req, res) {
  Book.findById(req.params.id, function(err, book) {
    if (err)
      return res
        .status(500)
        .send('There was a problem finding the book.');
    if (!book) 
        return res
            .status(404)
            .send('No book found.');
    res
        .status(200)
        .send(book);
  });
});

//delete a book from the database
router.delete('/:id', function(req, res) {
  Book.findByIdAndRemove(req.params.id, function(err, book) {
    if (err)
      return res
        .status(500)
        .send('There was a problem adding the information to the database.');
    if (!book)
         return res
            .status(404)
            .send('No book found.');
    res
        .status(200)
        .send('Book ' + book.name + ' was removed!');
  });
});

// update a single book in the database
router.put('/:id', function(req, res) {
  Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        function(err,book) {
            if (err)
                return res
                    .status(500)
                    .send('There was a problem updating the book.');
            if (!book)
                return res
                    .status(404)
                    .send('No book found.');
            res
                .status(200)
                .send(book);
  });
});

module.exports = router;
