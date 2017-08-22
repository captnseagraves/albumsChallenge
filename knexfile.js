'use strict';

module.exports = {
 development: {
   client: 'pg',
   connection: 'postgres://localhost/albumsChallenge'
 },
 production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  },
 test: {
   client: 'pg',
   connection: 'postgres://localhost/albumsChallenge_test',
    debug:false
 }
}
