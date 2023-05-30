const knex = require("../db/connection");

function list(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .whereNot({ status: "finished" })
      .andWhereNot({ status: "cancelled" })
      .orderBy("reservation_time", "asc");
  }

function create(newReservation) {
    return knex("reservations").insert(newReservation, "*");
}

function read(reservation_id) {
    return knex("reservations")
    .select(
        "*",
    )
    .where({reservation_id})
    .first()
}

function updateStatus(reservation_id, status) {
    return knex("reservations")
        .where({reservation_id})
        .update({status}, ["status"])
}

function searchReservationsWithMobile(mobile_number) {
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function update(updatedReservation) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id: updatedReservation.reservation_id })
      .update(updatedReservation, ["first_name", "last_name", "mobile_number", "people"])
  }

module.exports = {
    updateStatus,
    read,
    create,
    list,
    searchReservationsWithMobile,
    update,
}