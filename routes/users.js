'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(
      400,
      'Password must be at least 8 characters long'
    ));
  }

  knex('users')
    .select(knex.raw('1=1'))
    .where('email', email)
    .first()
    .then((exists) => {
      if (exists) {
        throw boom.create(400, 'Email already exists');
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const { firstName, lastName } = req.body;
      const insertUser = { firstName, lastName, email, hashedPassword };

      return knex('users')
        .insert(decamelizeKeys(insertUser), '*');
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;

      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3); // 3 hours
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '3h'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: expiry,
        secure: router.get('env') === 'production'
      });

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

// 'use strict';
//
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt-as-promised');
// const knex = require('../knex');
// const humps = require('humps');
//
// router.post('/users', (req, res, next) => {
//   let myUser;
//   bcrypt.hash(req.body.password, 12)
//     .then((hashed_password) => {
//         myUser = {
//         first_name: req.body.firstName,
//         last_name: req.body.lastName,
//         email: req.body.email,
//         hashed_password: hashed_password
//       };
//
//       return knex('users')
//         .insert(myUser, '*');
//     })
//     .then((users) => {
//       const user = users[0];
//       delete user.hashed_password;
//       res.send(humps.camelizeKeys(user));
//     })
//     .catch((err) => {
//       next(err);
//     });
// });
//
// module.exports = router;
