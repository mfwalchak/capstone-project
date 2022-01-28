const { KnexTimeoutError } = require("knex");
const { table } = require("../db/connection");
const knex = require("../db/connection");

function read(table_id){
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
};

function create(newTable) {
    console.log("knexCREATE", newTable);
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .where({reservation_id : newTable.reservation_id})
        .then((newTable) => newTable[0]);
}

function update(reservation_id, table_id){
    console.log("knexUpdate:", reservation_id, table_id);
    return knex("reservations")
        .where({ reservation_id })
        .update({ status: "seated" })
        .then(()=>{
            return knex("tables")
            .where({ table_id })
            .update({ reservation_id })
            .returning("*")
        });

}

module.exports = {
    read,
    list,
    create,
    update,
}