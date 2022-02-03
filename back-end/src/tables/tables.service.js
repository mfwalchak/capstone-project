const knex = require("../db/connection");

function read(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .where({ reservation_id: newTable.reservation_id })
    .then((newTable) => newTable[0]);
}

function update(reservation_id, table_id) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: "seated" })
    .then(() => {
      return knex("tables")
        .where({ table_id })
        .update({ reservation_id })
        .returning("*");
    });
}

function clearTable(reservation_id) {
  return knex("tables")
    .where({ reservation_id: reservation_id })
    .update({ reservation_id: null })
    .then(() => {
      return knex("reservations")
        .where({ reservation_id })
        .update({ status: "finished" })
        .returning("*");
    });
}

module.exports = {
  read,
  list,
  create,
  update,
  clearTable,
};
