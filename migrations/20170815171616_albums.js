exports.up = function(knex) {
  return knex.schema.createTable('albums', (tbl) => {
    tbl.increments();
    tbl.string('albumName').notNullable()
    tbl.integer('artist_id').references('artists.id')
    tbl.integer('genre_id').references('genres.id')
    tbl.integer('year_id').references('years.id')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('albums');
};
