exports.up = function(knex) {
  return knex.schema.createTable('albums', (tbl) => {
    tbl.increments();
    tbl.string('albumName').notNullable().unique()
    tbl.integer('artist_id').references('artists.id').onDelete('CASCADE')
    tbl.integer('genre_id').references('genres.id').onDelete('CASCADE')
    tbl.integer('year').notNullable()
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('albums');
};
