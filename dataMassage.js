const knex = require('./knex.js')
let albums = require('./albums.json')

function dataMassage() {
// for (var i = 0; i < albums.length; i++) {
    console.log(albums[0].artist);
    knex('artists')
    .select('*')
    .where('artistName', albums[0].artist)
    .then((artistsFromKnex) => {
      console.log('data', artistsFromKnex)
      if (artistsFromKnex.length === 0) {
        knex('artists')
        .insert('artistName', artistsFromKnex)
        console.log('add', artistsFromKnex.artistName);
      } else {
        console.log('already there', artistsFromKnex.artistName);
      }
    })
  // }

}

dataMassage()
