var express = require('express');
var router = express.Router();
const knex = require('../knex.js');

/* GET home page. */


router.get('/artists', (req, res, next) => {
  knex('artists')
    .select('artistName')
    .then((allArtists) => {
      res.send(allArtists)
    })
})

router.get('/:id', (req, res, next) => {
  console.log(req.params);
  let id = req.params.id
  knex('albums')
    .where('albums.id', id)
    .join('artists', 'albums.artist_id', 'artists.id' )
    .join('genres', 'albums.genre_id', 'genres.id' )
    .select('albums.albumName', 'artists.artistName', 'genres.genreName', 'albums.year')
    .then((selectedAlbum) => {
      res.send(selectedAlbum)
    })
})

router.get('/album/:name', (req, res, next) => {
  console.log(req.params.name);
  let name = req.params.name
  knex('albums')
    .where('albums.albumName', name)
    .join('artists', 'albums.artist_id', 'artists.id' )
    .join('genres', 'albums.genre_id', 'genres.id' )
    .select('albums.albumName', 'artists.artistName', 'genres.genreName', 'albums.year')
    .then((selectedAlbum) => {
      res.send(selectedAlbum)
    })
})




module.exports = router;
