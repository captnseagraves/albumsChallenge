var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/:id', (req, res, next) => {
  let id = req.params.id
  knex('albums')
    .where('id', id)
    .then((selectedAlbum) => {
      res.send(selectedAlbum)
    })
})

module.exports = router;
