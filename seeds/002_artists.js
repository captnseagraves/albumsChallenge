
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('artists').del()
    .then(function () {
      // Inserts seed entries
      return knex('artists').insert([
        {id: 1, artistName: 'Sylvan Esso'},
        {id: 2, artistName: 'Led Zeppelin'},
        {id: 3, artistName: 'The Beatles'}
      ]);
    });
};
