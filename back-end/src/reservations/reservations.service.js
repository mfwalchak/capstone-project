const knex = require("../db/connection");

function read(reservation_id){
    console.log("reseravtionsServiceRead:", reservation_id);
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}

function list(reservation_date, reservation_time) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: reservation_date })
        .orderBy("reservation_time")
};

function create(newReso) {
    console.log({newReso});
    return knex("reservations")
        .insert(newReso)
        .returning("*")
        .then((createdReservations) => createdReservations[0]);
}

function search(mobile_number) {
    console.log("KNEX SEARCH:", mobile_number);
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
  }

module.exports = {
    read,
    list,
    create,
    search
}