
exports.up = function(knex) {
    return knex.schema
    .withSchema('public')
    .dropTableIfExists('tables')
    .createTable('tables', (table) => {
      table.varchar("table_name").notNullable();
      table.smallint("capacity").notNullable();
      table.integer("reservation_id").unsigned();
      table.foreign("reservation_id").references("reservation_id").inTable("reservations");
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable("tables");
};
