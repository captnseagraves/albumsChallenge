
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('genres').del()
    .then(function () {
      // Inserts seed entries
      return knex('genres').insert([
        {id: 1, genreName: 'Synth Pop'},
        {id: 2, genreName: 'Hard Rock'},
        {id: 3, genreName: 'Psych Rock'}
      ]);
    })
    .then(() => {
          return knex.raw("SELECT setval('genres_id_seq', (SELECT MAX(id) FROM genres));")
      })
};
