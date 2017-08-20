var express = require('express');
var router = express.Router();
const knex = require('../knex.js');

/* GET home page. */


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
  console.log(req.params);
  let albumName = req.params.albumName
  let artistName = req.params.artistName
  let genreName = req.params.genreName
  let year = req.params.year

  function pAlbums() {
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

  function pArtists() {
    return knex('artists')
    .where('artistName', artistName)
    .then((artistNameFromKnex) => {
      if (artistNameFromKnex.length !== 0) {
         return artistNameFromKnex[0].id
      } else {
        console.log('else');
        return knex('artists')
          .insert({artistName: artistName})
          .returning('id')
          .then((newArtist) => {
            console.log('artist now');
            return newArtist[0]
        })
      }
    })
  }

  function pGenres() {
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
              console.log('genre now');

              return newGenre[0]
            })
        }
      })
    }


  function pNewAlbum(dataArr) {
    console.log('pNewAlbums');
    return knex('albums')
    .returning('id')
    .insert({
      albumName: dataArr[0],
      artist_id: dataArr[1],
      genre_id: dataArr[2],
      year: year
    })
    .then((newAl) => {
      console.log("newAl", newAl);
      return "Successfully created new album"
    })
    .catch((err) => {
      console.log('Album already exists');
      res.status(400)
      .send('Album already exists')
      return 'Album already exists'
      // if duplicate, errors out, but increases albums table id
    })
  }

function createAlbum() {
  return Promise.all([
    pAlbums(),
    pArtists(),
    pGenres()
  ])
  .then((results) => {
    console.log('result', results);
    return pNewAlbum(results)
  })
  .then((newAlbumResult) => {
    res.send(newAlbumResult)
  })
}

createAlbum()

})

// need to write case for changing name to album that already exists

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
      console.log('changedName', changedName);
      res.send('Successfully change album name')
    }
  })
  .catch((err) => {
    console.log('err', err);
  })
})

router.patch('/changeAlbumArtist/:albumName/:newArtistName', function(req, res, next) {
  let albumName = req.params.albumName
  let newArtistName = req.params.newArtistName

  function pArtists() {
    return knex('artists')
    .where('artistName', newArtistName)
    .then((artistNameFromKnex) => {
      if (artistNameFromKnex.length !== 0) {
         return artistNameFromKnex[0].id
      } else {
        console.log('else');
        return knex('artists')
          .insert({artistName: newArtistName})
          .returning('id')
          .then((newArtist) => {
            console.log('artist now');
            return newArtist[0]
        })
      }
    })
  }

// need to check if artist exists in other entries and delete name in artist table or not.

  function changeArtist() {
    return Promise.all([
      pArtists()
    ])
    .then((artist_id) => {
      console.log('artist-id', artist_id[0]);
      return knex('albums')
      .where('albumName', albumName)
      .update('artist_id', artist_id[0])
    })
    .then((changedID) => {
        console.log('changedID', changedID);
        res.send('Artist named changed')
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

  function pGenres() {
    return knex('genres')
    .where('genreName', newGenreName)
    .then((genreNameFromKnex) => {
      if (genreNameFromKnex.length !== 0) {
         return genreNameFromKnex[0].id
      } else {
        console.log('else');
        return knex('genres')
          .insert({genreName: newGenreName})
          .returning('id')
          .then((newGenre) => {
            console.log('genre now');
            return newGenre[0]
        })
      }
    })
  }

// need to check if genre exists in other entries and delete name in genre table or not.

  function changeGenre() {
    return Promise.all([
      pGenres()
    ])
    .then((genre_id) => {
      console.log('genre-id', genre_id[0]);
      return knex('albums')
      .where('albumName', albumName)
      .update('genre_id', genre_id[0])
    })
    .then((changedID) => {
        console.log('changedID', changedID);
        res.send('Genre named changed')
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
      console.log('changedName', changedName);
      res.send('Album year changed')
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
      console.log('deletedID', deletedID);
      res.send('Album successfully Deleted')
    })
});



module.exports = router;
