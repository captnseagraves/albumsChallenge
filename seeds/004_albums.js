
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('albums').del()
    .then(function () {
      // Inserts seed entries
      return knex('albums').insert([
        {
          id: 1,
          albumName: 'What Now',
          artist_id: 1,
          genre_id: 1,
          year: 2017
         },
        {
         id: 2,
         albumName: 'IV',
         artist_id: 2,
         genre_id: 2,
         year: 1972
        },
       {
        id: 3,
        albumName: 'Abbey Road',
        artist_id: 3,
        genre_id: 3,
        year: 1969
       },
      ]);
    })
    .then(() => {
          return knex.raw("SELECT setval('albums_id_seq', (SELECT MAX(id) FROM albums));")
      })
};
