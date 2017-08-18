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
    .then((albumNameFromKnex) => {
      if (albumNameFromKnex.length !== 0) {
         return albumNameFromKnex[0].albumName
      } else {
        return albumName
      }
    })
    .catch((err) => {
      console.log(err);
    })

  let pArtists = knex('artists')
    .where('artistName', artistName)
    .then((artistNameFromKnex) => {
      if (artistNameFromKnex.length !== 0) {
         return artistNameFromKnex[0].id
      } else {
        console.log('else');
        knex('artists')
          .insert({artistName: artistName})
          .returning('id')
          .then((newArtist) => {
            console.log('artist now');
            return newArtist[0]
        })
      }
    })

  let pGenres = knex('genres')
    .where('genreName', genreName)
    .then((genreNameFromKnex) => {
      if (genreNameFromKnex.length !== 0) {
          return genreNameFromKnex[0].id
        } else {
          knex('genres')
            .insert({genreName: genreName})
            .returning('id')
            .then((newGenre) => {
              console.log('genre now');

              return newGenre[0]
            })
        }
      })



  function pNewAlbum(dataArr) {
    console.log('pNewAlbums');
    knex('albums')
    .returning('id')
    .insert({
      albumName: dataArr[0],
      artist_id: dataArr[1],
      genre_id: dataArr[2],
      year: year
    })
    .then((newAl) => {
      console.log("newAl", newAl);
    })
    return "successful new album"
  }

  Promise.all([pAlbums, pArtists, pGenres])
  .then((result) => {
    console.log('result', result);
    pNewAlbum(result)
  })
  .then((result2) => {
    console.log(result2)
  })
  .catch((err) => {
    console.log(err);
  })

})



module.exports = router;
