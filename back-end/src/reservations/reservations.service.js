const knex = require("../db/connection");

function list(reservation_date, reservation_time) {
    return knex("reservations as r")
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
    list,
    create,
}