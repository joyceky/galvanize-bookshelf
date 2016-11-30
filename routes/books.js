'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');

var knex = require('../knex');

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.json(humps.camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
    knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      res.json(humps.camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    .insert({ name: req.body.name }, '*')
    .then((books) => {
      res.send(books[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books', (req, res, next) => {
  knex('books')
    .insert({ name: req.body.name }, '*')
    .then((books) => {
      res.send(books[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books', (req, res, next) => {
  knex('books')
    .insert({ name: req.body.name }, '*')
    .then((books) => {
      res.send(books[0]);
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
