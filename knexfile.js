'use strict';

module.exports = {
  development: {client: 'pg',
  connection: 'postgres://localhost/bookshelf_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
  },

  production: {
  	  client: 'pg',
  	  connection: process.env.DATABASE_URL
  	}
};

//
// module.exports = {
//         client: 'pg',
//         connection: {
//             host: "xxxx.amazonaws.com",
//             port: "xxxxx",
//             user: "xxxxx",
//             password: "xxxxx",
//             database: "xxxxx",
//             ssl: true
//     },
//         pool: {
//             min: 1,
//             max: 7
//         }
// };
