'use strict';

module.exports = {
 development: {
   client: 'pg',
   connection: 'postgres://localhost/albumChallenge'
 },
 production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  },
 test: {
   client: 'pg',
   connection: 'postgres://localhost/albumChallenge_test',
    debug:false
 }
}
