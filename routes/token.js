'use strict';

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const humps = require('humps');
const secret = process.env.JWT_SECRET;


let authorizedFlag = false;

// eslint-disable-next-line new-cap
const router = express.Router();

// make sure the user is not logged in
// check for the token
// if there is a token, check token against secret
// if token has right secret, log in
// if no token or wrong token, no log in
router.get('/token', (req, res, next) => {
    // console.log(req.cookies);
    res.send(authorizedFlag);
});

// create a token
// put it in a cookie
// a token is specific to the user
// require json webtoken
// look for the sign method
// also generate a cookie

// get the users id and password, then return encrypted
router.post('/token', (req, res, next) => {
    let myUser;

    if (req.body.email) {
        knex('users')
            .where('email', req.body.email)
            // .first()
            .then(function(result) {

                if (result.length === 0) {
                    next(boom.create(400, 'Bad email or password'));
                    return;
                } else {
                    myUser = result[0];
                    return bcrypt.compare(req.body.password, myUser.hashed_password);
                }
            })

        .then(() => {
            let myToken = generateToken(myUser);
            res.cookie('token', myToken, {
                httpOnly: true
            });

            delete myUser.created_at;
            delete myUser.updated_at;
            delete myUser.hashed_password;

            authorizedFlag = true;

            myUser = humps.camelizeKeys(myUser);

            res.status(200).send(myUser);
        })

        .catch(bcrypt.MISMATCH_ERROR, () => {
                throw boom.create(400, 'Bad email or password');
            })
            .catch((err) => {
                next(err);
            });
    }
});

router.get('/token', (req, res, next) => {
    res.send(authorizedFlag);
});

router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.send(true);
});

function generateToken(req) {
    var token = jwt.sign({
        auth: 'email',
        exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60 // Note: in seconds!
    }, secret); // secret is defined in the environment variable JWT_SECRET
    return token;
}


module.exports = router;
