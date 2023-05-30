const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasData(req, res, next) {
  if (req.body.data) {
    return next()
  }
  next({status: 400, message: "body must have data property"})
}

function hasReservationId(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  if (reservationId) {
    return next()
  }
  next({status: 400, message: "Must include reservation_id."})
}

async function idExists(req, res, next) {
  const data = await service.readReservation(req.body.data.reservation_id);
  if(data) {
    res.locals.reservation = data
    return next()
  }
  next({status: 404, message: `ReservationId: ${req.body.data.reservation_id} does not exist.`})
}

function hasTableName(req, res, next) {
  const table = req.body.data;
  if(table.table_name) {
    return next()
  }
  next({status: 400, message: "Must include table_name."})
}

function tableNameIsValid(req, res, next) {
  const tableName = req.body.data.table_name;
  if(tableName.length > 1) {
    return next()
  }
  next({status: 400, message: "Must include table_name."})
}

function hasCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if(capacity && capacity > 0 && typeof capacity === "number") {
    return next()
  }
  next({status: 400, message: "Must include capacity."})
}

async function hasSufficientCapacity(req, res, next) {
  const tableId = req.params.table_id
  const table = await service.read(Number(tableId));
  if (table) {
    res.locals.table = table
  }
  const reservation = res.locals.reservation
  if (table.capacity >= reservation.people) {
    return next();
  }
  next({status: 400, message: "People exceed capacity."});
}

function isOccupied(req, res, next) {
  const table = res.locals.table
  if (table.reservation_id === null) {
    return next()
  }
  next({status: 400, message: "Table is occupied"})
}

async function tableExists(req, res, next) {
  const tableId = req.params.table_id
  const data = await service.read(Number(tableId))
  if (data) {
    res.locals.table = data
    return next()
  }
  next({status: 404, message: `Table ${tableId} does not exist.`})
}

async function isNotOccupied(req, res, next) {
  const table = res.locals.table
  if (table.reservation_id !== null) {
    return next()
  }
  next({status: 400, message: "Table is not occupied"})
}

function isSeated(req, res, next) {
  const reservation = res.locals.reservation
  if (reservation.status === "seated") {
    return next({status: 400, message: "Table cannot be seated"})
  }
  next()
}

async function create(req, res) {
  const dataArray = await service.create(req.body.data);
  const data = dataArray[0]
  res.status(201).json({
    data
  });
}

async function list(req, res) {
  const data = await service.list();
  res.json({
    data,
  });
}

async function updateOccupancy(req, res) {
    const reservation_id = req.body.data.reservation_id;
    const table_id = res.locals.table.table_id
    await reservationService.updateStatus(reservation_id, "seated")
    const data = await service.updateOccupancy(reservation_id, table_id);
    res.status(200).json({
      data
    });
}

async function finishTable(req, res) {
  const reservation_id = res.locals.table.reservation_id
  const table_id = res.locals.table.table_id
  const data = await service.finishTable(table_id, reservation_id);
  res.json({
    data
  });
}

module.exports = {
  finishTable: [asyncErrorBoundary(tableExists), isNotOccupied, asyncErrorBoundary(finishTable)],
  create: [hasData, hasTableName, tableNameIsValid, hasCapacity, asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  updateOccupancy: [hasData, hasReservationId, asyncErrorBoundary(idExists), asyncErrorBoundary(tableExists), asyncErrorBoundary(hasSufficientCapacity), isSeated, isOccupied, asyncErrorBoundary(updateOccupancy)]
};