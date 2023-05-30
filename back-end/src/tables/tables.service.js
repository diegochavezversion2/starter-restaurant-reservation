const knex = require("../db/connection");

function list() {
    return knex.select("*").from("tables").orderBy('table_name')
}

function create(newTable) {
    return knex("tables").insert(newTable, ["table_name", "capacity"]);
}

function updateOccupancy(reservation_id, table_id) {
    return knex("tables")
        .where({table_id: table_id})
        .update({reservation_id: reservation_id})
    }

function readReservation(reservationId) {
    return knex("reservations")
    .select(
        "*",
    )
    .where("reservation_id", reservationId)
    .first()
}

function read(tableId) {
    return knex("tables")
    .select(
        "*",
    )
    .where("table_id", tableId)
    .first()
}

function finishTable(table_id, reservation_id) {
    return knex.transaction(function(trx) {
        return trx("tables")
        .where({table_id})
        .update({reservation_id: null})
        .then(() => {
            return trx("reservations")
            .where({reservation_id})
            .update({status: "finished"})
        })
    })
}



module.exports = {
    finishTable,
    read,
    readReservation,
    create,
    list,
    updateOccupancy,

}