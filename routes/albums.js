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


router.get('/artistAlbums/:name', (req, res, next) => {
  console.log(req.params.name);
  let name = req.params.name
  knex('artists')
    .where('artists.artistName', name)
    .join('albums', 'albums.artist_id', 'artists.id' )
    .select('albums.albumName')
    .then((artistAlbums) => {
      res.send(artistAlbums)
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

router.get('/artistAlbums/:name', (req, res, next) => {
  console.log(req.params.name);
  let name = req.params.name
  knex('artists')
    .where('artists.artistName', name)
    .join('albums', 'albums.artist_id', 'artists.id' )
    .select('albums.albumName')
    .then((artistAlbums) => {
      res.send(artistAlbums)
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
    .catch((err) => {
      console.log('Album already exists');
      // if duplicate, errors out, but increases albums table id
    })
    return "successful new album"
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
  .catch((err) => {
    // still logs whole error, rather than just notice
    console.log("Album already exists");
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
      res.send('Album doesn\'t exist. Please, enter valid title.')
    } else {
      console.log('changedName', changedName);
      res.send('Album named changed')
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




module.exports = router;
