const knex = require('./knex.js')
let albums = require('./albums.json')
let routes = require('./routes/albums.js')

console.log('albums.length', albums.length);

let dataLength = albums.length
let count = dataLength

const dataMassage = () => {
    let artistName = albums[count-1].artist
    let albumName = albums[count-1].album
    let genreName = albums[count-1].genre
    let year = albums[count-1].year

    //Inserts new Album into albums table
    const pNewAlbum = (dataArr) => {
      console.log('pNewAlbum');
    return knex('albums')
    .returning('id')
    .insert({
      albumName: dataArr[0],
      artist_id: dataArr[1],
      genre_id: dataArr[2],
      year: year
    })
    .then((newAl) => {
      console.log('Successfully created new album');
      return "Successfully created new album"
    })
    .catch((err) => {
      console.log('Album already exists');
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



  //Checks if album name already exists.
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

  //Checks if artist name already exists. Creates artist in artists table if does not exists.
  const pArtists = (artistName) => {
   return knex('artists')
   .where('artistName', artistName)
   .then((artistNameFromKnex) => {
     console.log('********artistNameFromKnex', artistNameFromKnex);
     if (artistNameFromKnex.length !== 0) {
       return artistNameFromKnex[0].id
     } else {
       return knex('artists')
         .insert({artistName: artistName})
         .returning('id')
         .then((newArtist) => {
           console.log('newArtist', newArtist);
           return newArtist[0]
       })
     }
   })
  }

  //Checks if genre name already exists. Creates genre in genres table if does not exists.
  const pGenres = (genreName) => {
     return knex('genres')
     .where('genreName', genreName)
     .then((genreNameFromKnex) => {
       console.log('*********genreNameFromKnex', genreNameFromKnex);
       if (genreNameFromKnex.length !== 0) {
           return genreNameFromKnex[0].id
         } else {
           return knex('genres')
             .insert({genreName: genreName})
             .returning('id')
             .then((newGenre) => {
               console.log('newGenre', newGenre);
               return newGenre[0]
             })
         }
       })
     }

     createAlbum()

  if (count === 1) {
    return
  } else {
    count--
    dataMassage()
  }
}

dataMassage()
