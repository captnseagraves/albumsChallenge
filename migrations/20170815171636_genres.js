exports.up = function(knex) {
  return knex.schema.createTable('genres', (tbl) => {
    tbl.increments();
    tbl.string('genreName').notNullable().unique()
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('genres');
};
