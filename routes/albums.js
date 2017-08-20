var express = require('express');
var router = express.Router();
const knex = require('../knex.js');


router.get('/allArtists', (req, res, next) => {
  knex('artists')
    .select('artistName')
    .then((allArtists) => {
      res.send(allArtists)
    })
})

router.get('/allArtistAlbums/:artistName', (req, res, next) => {
  let artistName = req.params.artistName
  knex('artists')
    .where('artists.artistName', artistName)
    .join('albums', 'albums.artist_id', 'artists.id' )
    .select('albums.albumName')
    .then((artistAlbums) => {
      res.send(artistAlbums)
    })
})

router.get('/album/:albumName', (req, res, next) => {
  let albumName = req.params.albumName
  knex('albums')
    .where('albums.albumName', albumName)
    .join('artists', 'albums.artist_id', 'artists.id' )
    .join('genres', 'albums.genre_id', 'genres.id' )
    .select('albums.albumName', 'artists.artistName', 'genres.genreName', 'albums.year')
    .then((selectedAlbum) => {
      res.send(selectedAlbum)
    })
})

router.post('/newAlbum/:albumName/:artistName/:genreName/:year', (req, res, next) => {
  let albumName = req.params.albumName
  let artistName = req.params.artistName
  let genreName = req.params.genreName
  let year = req.params.year

  const pNewAlbum = (dataArr) => {
    return knex('albums')
    .returning('id')
    .insert({
      albumName: dataArr[0],
      artist_id: dataArr[1],
      genre_id: dataArr[2],
      year: year
    })
    .then((newAl) => {
      res.send("Successfully created new album")
      return "Successfully created new album"
    })
    .catch((err) => {
      res.status(400)
      .send('Album already exists')
      return 'Album already exists'
    })
  }

  const createAlbum = () => {
    return Promise.all([
      pAlbums(albumName),
      pArtists(artistName),
      pGenres(genreName)
    ])
    .then((results) => {
      return pNewAlbum(results)
    })
  }

  createAlbum()
})

router.patch('/changeAlbumName/:albumName/:newAlbumName', function(req, res, next) {
  let albumName = req.params.albumName
  let newAlbumName = req.params.newAlbumName
  knex('albums')
  .where('albumName', albumName)
  .update('albumName', newAlbumName)
  .then((changedName) => {
    if (changedName === 0) {
      res.status(400)
      .send('Album doesn\'t exist. Please, enter valid title.')
    } else {
      res.send('Successfully changed album name')
    }
  })
  .catch((err) => {
    console.log('err', err);
  })
})

router.patch('/changeAlbumArtist/:albumName/:newArtistName', function(req, res, next) {
  let albumName = req.params.albumName
  let newArtistName = req.params.newArtistName

  const changeArtist = () => {
    return Promise.all([
      pArtists(newArtistName)
    ])
    .then((artist_id) => {
      return knex('albums')
      .where('albumName', albumName)
      .update('artist_id', artist_id[0])
    })
    .then((changedID) => {
      res.send('Successfully changed artist name')
    })
    .catch((err) => {
      console.log('err', err);
    })
  }

  changeArtist()
})

router.patch('/changeAlbumGenre/:albumName/:newGenreName', function(req, res, next) {
  let albumName = req.params.albumName
  let newGenreName = req.params.newGenreName

  function changeGenre() {
    return Promise.all([
      pGenres(newGenreName)
    ])
    .then((genre_id) => {
      return knex('albums')
      .where('albumName', albumName)
      .update('genre_id', genre_id[0])
    })
    .then((changedID) => {
      res.send('Successfully changed genre name')
    })
    .catch((err) => {
      console.log('err', err);
    })
  }

  changeGenre()
})

router.patch('/changeAlbumYear/:albumName/:newAlbumYear', function(req, res, next) {
  let albumName = req.params.albumName
  let newAlbumYear = req.params.newAlbumYear
  knex('albums')
  .where('albumName', albumName)
  .update('year', newAlbumYear)
  .then((changedName) => {
    if (changedName === 0) {
      res.send('Album doesn\'t exist. Please, enter valid title.')
    } else {
      res.send('Successfully changed album year')
    }
  })
  .catch((err) => {
    console.log('err', err);
  })
})

router.delete('/deleteAlbum/:albumName', function(req, res, next) {
  let albumName = req.params.albumName
  knex('albums')
    .where('albumName', albumName)
    .del()
    .then((deletedID) => {
      if (deletedID === 0) {
        res.status(400)
        .send('Album doesn\'t exist. Please, enter valid title.')
      } else {
        res.send('Successfully deleted album')
      }
    })
});

const pAlbums = (albumName) => {
   return knex('albums')
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
 }

const pArtists = (artistName) => {
   return knex('artists')
   .where('artistName', artistName)
   .then((artistNameFromKnex) => {
     if (artistNameFromKnex.length !== 0) {
       return artistNameFromKnex[0].id
     } else {
       return knex('artists')
         .insert({artistName: artistName})
         .returning('id')
         .then((newArtist) => {
           return newArtist[0]
       })
     }
   })
 }

 const pGenres = (genreName) => {
     return knex('genres')
     .where('genreName', genreName)
     .then((genreNameFromKnex) => {
       if (genreNameFromKnex.length !== 0) {
           return genreNameFromKnex[0].id
         } else {
           return knex('genres')
             .insert({genreName: genreName})
             .returning('id')
             .then((newGenre) => {
               return newGenre[0]
             })
         }
       })
     }

module.exports = router;
