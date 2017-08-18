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
  console.log(req.params.year);
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

router.post('/newAlbum/:albumName/:artistName/:genreName/:year', (req, res, next) => {
  console.log(req.params);
  let albumName = req.params.albumName
  let artistName = req.params.artistName
  let genreName = req.params.genreName
  let year = req.params.year

  let pAlbums = knex('albums')
  .where('albumName', albumName)
  .then((artistNameFromKnex) => {
    if (artistNameFromKnex.length !== 0) {
      res.sendStatus(403)
    }
  })

  let pArtists = knex('artists')
    .where('artistName', artistName)
    .then((artistNameFromKnex) => {
      if (artistNameFromKnex.length !== 0) {
        artistName = artistNameFromKnex[0].id
      } else {
        console.log('else');
        knex('artists')
          .insert({artistName: artistName})
          .returning('id')
          .then((newArtist) => {
            artistName = newArtist[0]
        })
      }
    })

  let pGenres = knex('genres')
    .where('genreName', genreName)
    .then((genreNameFromKnex) => {
      if (genreNameFromKnex.length !== 0) {
          console.log('if');
          genreName = genreNameFromKnex[0].id
        } else {
          console.log('else');
          knex('genres')
            .insert({genreName: genreName})
            .returning('id')
            .then((newGenre) => {
              genreName = newGenre[0]
              console.log('newGenre', newGenre[0]);
            })
        }
      })



  let pNewAlbum = knex('albums')
    .returning('id')
    .insert({
      albumName: albumName,
      artist_id: artistName,
      genre_id: genreName,
      year: year
    })


  Promise.all([pAlbums, pArtists, pGenres, pNewAlbum])
  .then((result) => {
    console.log('result', result);
    res.send('successful new album')
  })

})



module.exports = router;
