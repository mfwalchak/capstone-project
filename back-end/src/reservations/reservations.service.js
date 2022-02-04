const knex = require("../db/connection");

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}

function listByResoDate(reservation_date, reservation_time) {
  return knex("reservations")
  .select("*")
  .whereNot({ status: 'finished' }) //added 2.2 for test 6 validation
  .whereNot({status: 'cancelled'}) //added 2.2. for test 6 validation
  .where({ reservation_date: reservation_date })
  .orderBy("reservation_time");
}

function create(newReso) {
  console.log({ newReso });
  return knex("reservations")
    .insert(newReso)
    .returning("*")
    .then((createdReservations) => createdReservations[0]);
}

function search(mobile_number) {
  //console.log("KNEX SEARCH MOBILE NUMBER:", mobile_number);
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function updateResoStatus(reservation_id, status) {
  console.log("knexUpdateResoStatus:", status);
  return knex("reservations")
    .where({ reservation_id })
    .update({ status })
    .then(() => read(reservation_id));
}

function updateReso(updatedReso) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReso.reservation_id })
    .update(updatedReso, "*")
    .then((reso) => reso[0]);
}

function destroy(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).del();
}

module.exports = {
  read,
  list,
  listByResoDate,
  create,
  search,
  updateResoStatus,
  updateReso,
  destroy,
};
