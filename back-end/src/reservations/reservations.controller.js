/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasData(req, res, next) {
  if (req.body.data) {
    return next()
  }
  next({status: 400, message: "body must have data property"})
}

function hasFirstName(req, res, next) {
  const firstName = req.body.data.first_name;
  if(firstName) {
    return next()
  }
  next({status: 400, message: "Must include first_name."})
}
function hasLastName(req, res, next) {
  const lastName = req.body.data.last_name;
  if(lastName) {
    return next()
  }
  next({status: 400, message: "Must include last_name."})
}
function hasPhoneNumber(req, res, next) {
  const mobileNumber = req.body.data.mobile_number;
  if(mobileNumber) {
    return next()
  }
  next({status: 400, message: "Must include mobile_number."})
}
function hasReservationDate(req, res, next) {
  const reservationDate = req.body.data.reservation_date;
  if(reservationDate) {
    return next()
  }
  next({status: 400, message: "Must include reservation_date."})
}

function dateIsDate(req, res, next) {
  const reservationDate = req.body.data.reservation_date;
  const stringDate = reservationDate.split('-').join('');
  if(isNaN(Number(stringDate))) {
    next({status: 400, message: "Must include reservation_date."})
  }
  return next()
}

function hasReservationTime(req, res, next) {
  const reservationTime = req.body.data.reservation_time;
  if(reservationTime) {
    return next()
  }
  next({status: 400, message: "Must include reservation_time."})
}

function timeIsTime(req, res, next) {
  const reservationTime = req.body.data.reservation_time;
  const stringTime = reservationTime.split(':').join('');
  if(isNaN(Number(stringTime))) {
    next({status: 400, message: "Must include reservation_time."})
  }
  return next()
}

function peopleIsANumber(req, res, next) {
  const people = req.body.data.people;
  if( typeof people === 'number') {
    return next()
  }
  next({status: 400, message: "Must include people."})
}

function hasPeople(req, res, next) {
  const people = req.body.data.people;
  if(people) {
    return next()
  }
  next({status: 400, message: "Must include people."})
}

function checkStatus(req, res, next) {
  const status = req.body.data.status;
  if (status === "seated") {
    return next({status: 400, message: "Status cannot be seated."})
  }
  if (status === "finished") {
    return next({status: 400, message: "Status cannot be finished."})
  }
  next()
}

function tooEarlyOrTooLate(req, res, next) {
  const timeFromReq = req.body.data.reservation_time;
  const splitHrsAndMin = timeFromReq.split(':');
  const hour = Number(splitHrsAndMin[0]);
  const minute = Number(splitHrsAndMin[1]);
  const dateFromReq = req.body.data.reservation_date;
  const date = new Date(dateFromReq);
  const reservationDay = date.getUTCDate();
  const reservationMonth = date.getUTCMonth();
  const reservationYear = date.getUTCFullYear();
  let currentDate = new Date(Date.now());
  let today = currentDate.getUTCDate();
  let thisMonth = currentDate.getUTCMonth();
  let thisYear = currentDate.getUTCFullYear();
  let thisHour = currentDate.getHours();
  let thisMinute = currentDate.getMinutes();
  if (hour === 10 && minute < 30) {
    next({status: 400, message: "Too Early, Minute"})
  }
  if (hour < 10) {
    next({status: 400, message: "Too Early, hour"})
  }
  if (hour === 21 && minute > 30) {
    next({status: 400, message: "Too Late"})
  }
  if (hour > 21) {
    next({status: 400, message: "Too Late"})
  }
  if (reservationYear === thisYear && reservationMonth === thisMonth && reservationDay === today && hour === thisHour && minute < thisMinute) {
    next({status: 400, message: "Pick a later minute."})
  }
  if (reservationYear === thisYear && reservationMonth === thisMonth && reservationDay === today && hour < thisHour) {
    next({status: 400, message: "Pick a later hour."})
  }
  next();
}

function notOnTuesday(req, res, next) {
  const dateFromReq = req.body.data.reservation_date;
  const date = new Date(dateFromReq);
  const day = date.getUTCDay();
  if (day !== 2) {
    return next()
  }
  next({status: 400, message: 'The restaurant is closed on Tuesdays.'})
}

function notOnPreviousDate(req, res, next) {
  const dateFromReq = req.body.data.reservation_date;
  const date = new Date(dateFromReq);
  const reservationDay = date.getUTCDate();
  const reservationMonth = date.getUTCMonth();
  const reservationYear = date.getUTCFullYear();
  let currentDate = new Date(Date.now());
  let today = currentDate.getUTCDate();
  let thisMonth = currentDate.getUTCMonth();
  let thisYear = currentDate.getUTCFullYear();
  if (thisYear > reservationYear) {
    return next({status: 400, message: 'Reservation must be in a future year.'})
  }
  if (reservationYear === thisYear && thisMonth > reservationMonth) {
    return next({status: 400, message: 'Reservation must be in a future month.'})
  }
  if (reservationYear >= thisYear && reservationMonth === thisMonth && today > reservationDay) {
    return next({status: 400, message: 'Reservation must be in a future day.'})
  }
  next();
}

function statusOfStatus(req, res, next) {
  const reservation = res.locals.reservation
  if (reservation.status === "finished") {
    return next({status: 400, message: 'Status cannot be finished'})
  }
  next()
}

function statusExistsInRequest(req, res, next) {
  const status = req.body.data.status
  if (status === "finished" || status === "seated" || status === "booked" || status === "cancelled") {
    return next()
  }
  next({status: 400, message: 'Status cannot be unknown'})
}

async function idExists(req, res, next) {
  const response = await service.read(req.params.reservation_id);
  if(response) {
    res.locals.reservation = response
    return next()
  }
  next({status: 404, message: `ReservationId: ${req.params.reservation_id} does not exist.`})
}

async function list(req, res) {
  if (req.query.date) {
    
    const date = req.query.date
    const data = await service.list(date);
    res.json({
      data,
    });
  }
  else if (req.query.mobile_number) {
    const mobile_number = req.query.mobile_number
    const data = await service.searchReservationsWithMobile(mobile_number);
    res.json({
      data,
    });
  }
}

async function create(req, res) {
  const dataArray = await service.create(req.body.data);
  const data = dataArray[0]
  res.status(201).json({
    data
  });
}

async function read(req, res, next) {
  const data = res.locals.reservation
  res.json({data});
}

async function updateStatus(req, res) {
  const reservation_id = req.params.reservation_id
  const status = req.body.data.status
  const dataFromService = await service.updateStatus(reservation_id, status);
  const data = dataFromService[0];
  res.json({
    data
  });
}

async function update(req, res, next) {
  const updatedReservation = req.body.data;
  const dataArray = await service.update(updatedReservation)
  const data = dataArray[0]
  res.json({data});
}

module.exports = {
  read: [asyncErrorBoundary(idExists), asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  create: [
    hasData, 
    hasFirstName, 
    hasLastName, 
    hasPhoneNumber, 
    hasReservationDate,
    dateIsDate, 
    hasReservationTime,
    timeIsTime, 
    hasPeople,
    peopleIsANumber, 
    notOnPreviousDate, 
    notOnTuesday, 
    tooEarlyOrTooLate,
    checkStatus,
    asyncErrorBoundary(create),
  ],
  update: [
    hasData,
    hasFirstName,
    hasLastName,
    hasPhoneNumber,
    hasReservationDate,
    dateIsDate,
    hasReservationTime,
    timeIsTime, 
    hasPeople,
    peopleIsANumber, 
    notOnPreviousDate, 
    notOnTuesday, 
    tooEarlyOrTooLate,
    asyncErrorBoundary(idExists),
    asyncErrorBoundary(update)
  ],
  updateStatus: [asyncErrorBoundary(idExists), statusExistsInRequest, statusOfStatus, asyncErrorBoundary(updateStatus)],
};
