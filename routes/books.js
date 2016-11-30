'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');

var knex = require('../knex');

//GET http handler for books
router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.json(humps.camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

//GET http handler for books by id
router.get('/books/:id', (req, res, next) => {
    knex('books')
    .where('id', req.params.id)
    .first()
    .then((books) => {
      if (!books) {
        return next();
      }

      res.json(humps.camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

// router.post('/books', (req, res, next) => {
//   knex('books')
//     .insert({
//       title: req.body.title,
//       author: req.body.author,
//       genre: req.body.genre,
//       description: req.body.description,
//       cover_url: req.body.cover_url,
//       created_at: req.body.created_at,
//       updated_at: req.body.updated_at
//     }, '*')
//     .then((books) => {
//       res.send(books[0]);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

//PATCH http handler for books by id
router.patch('/books/:id', (req, res, next) => {
    knex('books')
    .where('id', req.params.id)
    .first()
// Make sure we have a book
    .then((book) => {
      if (!book) {
        return next();
      }
// user requests book by id to modify
// get the user data
// get the book
// see if what the user wants to enter is the same as the book
// if there are differences, change the book to the user data
// update the book
// return the book
      if (req.body !== book) {
        book = req.body;
      }
      book.title = compareValues(book.title, req.body.title);
      book.author = compareValues(book.author, req.body.author);
      book.genre = compareValues(book.genre, req.body.genre);
      book.description = compareValues(book.description, req.body.description);
      book.cover_url = compareValues(book.cover_url, req.body.cover_url);
      book.created_at = compareValues(book.created_at, req.body.created_at);
      book.updated_at = compareValues(book.updated_at, req.body.updated_at);

      console.log(req.body);
      console.log(book);
      console.log("BASTARDDDD");
      res.json(humps.camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

function compareValues (originalValue, userInput) {
  if(originalValue === userInput) {
    return originalValue;
  }
  else {
    return userInput;
  }
}
//DELETE http handler for books by id
// router.delete('/books/:id', (req, res, next) => {
//     knex('books')
//     .where('id', req.params.id)
//     .first()
//     .then((book) => {
//       if (!book) {
//         return next();
//       }
//
//       res.json(humps.camelizeKeys(book));
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

module.exports = router;
