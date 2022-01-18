const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*");
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