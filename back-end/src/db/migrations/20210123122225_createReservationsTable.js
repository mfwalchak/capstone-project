exports.up = function (knex) {
  return knex.schema
    .dropTableIfExists("reservations")
    .withSchema("public")
    .createTable("reservations", (table) => {
      table.timestamps(true, true); 
      table.varchar("first_name");
      table.varchar("last_name");
      table.varchar("mobile_number").notNullable();
      table.date("reservation_date").notNullable();
      table.time("reservation_time").notNullable();
      table.smallint("people").notNullable();
      table.increments("reservation_id").primary();
      table.varchar("status")

  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("reservations");
};
