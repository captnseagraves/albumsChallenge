exports.up = function(knex) {
  return knex.schema.createTable('years', (tbl) => {
    tbl.increments();
    tbl.string('yearName').notNullable()
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('years');
};
