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

//POST http handler for books
router.post('/books', (req, res, next) => {
  const { title, author, genre, description,coverUrl } = req.body;
  var insertBook = humps.decamelizeKeys({ title, author, genre, description,coverUrl  });
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
  const { title, author, genre, description, coverUrl } = req.body;
    knex('books')
      .where('id', req.params.id)
      .first()
      .then((book) => {
        if (!book) {
          return next();
        }
    const updateBook = humps.decamelizeKeys({ title, author, genre, description, coverUrl});
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

  //DELETE http handler for books by id
    // router.delete('/books/:id', (req, res, next) => {
    //   var myBook;
    //   const { title, author, genre, description, coverUrl } = req.body;
    //     knex('books')
    //       .where('id', req.params.id)
    //       .first()
    //       .then((book) => {
    //         if (!book) {
    //           return next();
    //         }
    //         myBook = humps.decamelizeKeys({ title, author, genre, description, coverUrl});
    //         return knex('books')
    //           .where('id', req.params.id)
    //           .del();
    //       })
    //       .then((rows) => {
    //         const book = humps.camelizeKeys(rows[0]);
    //         console.log(book);
    //       })
    //       .catch((err) => {
    //         next(err);
    //       });
    // });

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




  // router.patch('/books/:id', (req, res, next) => {
  //   // const { title , author, genre, description,coverUrl} = req.body;
  //   // var myId = req.params.id;
  //   // console.log(myId);
  //   // knex('books')
  //   //   .where('id', myId)
  //   //   .then((book) => {
  //   //     console.log(book);
  //   //     if( req.body.title ) {
  //   //       .update((book), *)
  //   //       .then
  //   //     }
  //   //     res.send(book);
  //   //   });
  // var updateBook = humps.decamelizeKeys({ title, author, genre, description,coverUrl  })
  // knex('books')
  //   where('id', req.params.id)
  //   .first()
  //   .update((updateBook), '*')
  //   .then((response) => {
  //     const book = humps.camelizeKeys(response[0]);
  //     res.send(book);
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
  // });






module.exports = router;
