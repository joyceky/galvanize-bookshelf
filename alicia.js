"use strict";

function promisesPromises() {
  console.log("About to return a promise...");
  return new Promise((resolve, reject) => {
    resolve(7);
  });
}

const whatJustHappened = promisesPromises();

whatJustHappened.then((result) => {
  console.log("Success " + result);
  return result * 3;
})
.then((result) => {
  console.log("More success " + result);
})
.catch((err) => {
  console.log("BAD! " + err);
});

console.log("Wating for promises...");


EXPECTED
{ title: 'JavaScript, The Good Parts',
  author: 'Douglas Crockford',
  genre: 'JavaScript',
  description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript that\'s more reliable, readable, and maintainable than the language as a whole—a subset you can use to create truly extensible and efficient code.',
  coverUrl: 'https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/284/javascript_the_good_parts.jpg' }

  GOT
{ title: 'JavaScript, The Good Parts',
  author: 'Douglas Crockford',
  genre: 'JavaScript',
  description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript that\'s more reliable, readable, and maintainable than the language as a whole—a subset you can use to create truly extensible and efficient code.',
  cover_url: 'https://students-gschool-production.s3.amazonaws.com/uploads/asset/file/284/javascript_the_good_parts.jpg' }
