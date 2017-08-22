exports.up = function(knex) {
  return knex.schema.createTable('artists', (tbl) => {
    tbl.increments();
    tbl.string('artistName').notNullable().unique()
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('artists');
};
