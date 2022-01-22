const knex = require("../db/connection");

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
};

function create(seatParty) {
    console.log("knex", seatParty);
    return knex("tables")
        .insert(seatParty)
        .returning("*")
        .where({reservation_id : seatParty.reservation_id})
        .then((seatParty) => seatParty[0]);
}

module.exports = {
    list,
    create,
}