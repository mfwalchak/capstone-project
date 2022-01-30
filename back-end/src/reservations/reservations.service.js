const knex = require("../db/connection");

function read(reservation_id){
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first
}

function list(reservation_date, reservation_time) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .orderBy("reservation_time")
};

function create(newReso) {
    console.log({newReso});
    return knex("reservations")
        .insert(newReso)
        .returning("*")
        .then((createdReservations) => createdReservations[0]);
}

module.exports = {
    read,
    list,
    create,
}