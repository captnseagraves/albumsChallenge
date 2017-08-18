var express = require('express');
var router = express.Router();
const knex = require('../knex.js');

/* GET home page. */


router.get('/:id', (req, res, next) => {
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


const getUserCats = (userId) => {
    return knex('user_category')
        .join('categories', 'categories.id', 'user_category.category_id')
        .where('user_category.user_id', userId)
}


module.exports = router;
