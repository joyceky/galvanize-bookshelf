'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');
const knex = require('../knex');

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

//POST http handler for books
router.post('/books', (req, res, next) => {
    const {
        title,
        author,
        genre,
        description,
        coverUrl
    } = req.body;
    let insertBook = humps.decamelizeKeys({
        title,
        author,
        genre,
        description,
        coverUrl
    });
    knex('books')
        .insert((insertBook), '*')
        .then((rows) => {
            const book = humps.camelizeKeys(rows[0]);
            res.send(book);
        })
        .catch((err) => {
            next(err);
        });
});

//PATCH http handler for books by id
router.patch('/books/:id', (req, res, next) => {
    const {
        title,
        author,
        genre,
        description,
        coverUrl
    } = req.body;
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((book) => {
            if (!book) {
                return next();
            }
            const updateBook = humps.decamelizeKeys({
                title,
                author,
                genre,
                description,
                coverUrl
            });
            return knex('books')
                .update(updateBook, '*')
                .where('id', req.params.id);
        })
        .then((rows) => {
            const book = humps.camelizeKeys(rows[0]);
            res.send(book);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/books/:id', (req, res, next) => {
      let book;
      knex('books')
          .where('id', req.params.id)
          .first()
          .then((row) => {
              if (!row) {
                  return next();
              }

              book = row;

              return knex('books')
                  .del()
                  .where('id', req.params.id);
          })
          .then(() => {
              delete book.id;
              delete book.created_at;
              delete book.updated_at;
              res.send(humps.camelizeKeys(book));
          })
          .catch((err) => {
              next(err);
          });
        });

module.exports = router;
