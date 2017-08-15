exports.up = function(knex) {
  return knex.schema.createTable('genres', (tbl) => {
    tbl.increments();
    tbl.string('genreName').notNullable()
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('genres');
};
