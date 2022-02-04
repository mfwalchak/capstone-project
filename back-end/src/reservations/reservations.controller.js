const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

//validations for new and edited reservations

function isValidDateFormat(req, res, next) {
  let { data = {} } = req.body;
  let date = data.reservation_date;
  try {
    if (!/\d\d\d\d-\d\d-\d\d/.test(date)) {
      const error = new Error("reservation_date");
      error.message = "invalid reservation_date";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

function isNotATuesday(req, res, next) {
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let day = new Date(`${data.reservation_date} ${data.reservation_time}`);
  try {
    if (day.getDay() === 2) {
      const error = new Error(`${date}`);
      error.message = "closed";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
/* ******BUG FIX NEEDED: This works locally. Deployed version throws error for reservations made on the same day******** */
function reservationNotInPast(req, res, next) {
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let time = data.reservation_time;
  let day = new Date(`${data.reservation_date} ${data.reservation_time}`);

  try {
    let now = new Date();
    if (day < now) {
      const error = new Error(`${date}`);
      error.message = "reservation must be in the future";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validate reservation is during operating hours
function reservationIsDuringBusinessHours(req, res, next) {
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let time = data.reservation_time;
  try {
    if (time < "10:30" || time >= "21:30") {
      const error = new Error(`${time}`);
      error.message = "reservation_time is invalid";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validate reservation is not being prior to current time
function reservationIsEarlierToday(req, res, next) {
  let { data = {} } = req.body;
  let time = data.reservation_time;
  let now = new Date();
  try {
    if (time < now) {
      const error = new Error(`${time}`);
      error.message = "Reservation must be for a time in the future";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validate time is correctly formatted
function isValidTimeFormat(req, res, next) {
  let { data = {} } = req.body;
  let time = data.reservation_time;
  try {
    if (!/\d\d:\d\d/.test(time)) {
      const error = new Error("reservation_time");
      error.message = "Time Validation Error";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validate party is a number
function isPartyValid(req, res, next) {
  let { data = {} } = req.body;
  let party = data.people;
  try {
    if (typeof party != "number") {
      let error = new Error(`people must be a number.`);
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validate that an updated status is one of the four acceptable statuses
function reservationStatusCheck(req, res, next) {
  const { status } = req.body.data;
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `Reservation status is ${status}. Must be booked, seated, finished or cancelled.`,
    });
  }
  next();
}
//validate that update attempt is not on a finished reservation
function reservationIsFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: `${status} reservations cannot be updated`,
    });
  }
  next();
}
//validation checks if the reservation status is currently booked
function reservationAlreadyExists(req, res, next) {
  if (req.body.data.status) {
    if (req.body.data.status !== "booked") {
      next({
        status: 400,
        message: `Reservation is already ${req.body.data.status}`,
      });
    }
  }
  next();
}

//CRUD OPERATIONS
//check if reservation data exists
async function reservationExists(req, res, next) {
  const data = await reservationsService.read(req.params.reservation_Id);
  if (data) {
    res.locals.reservation = data;
    return next();
  }
  next({
    status: 404,
    message: `reservation ${req.params.reservation_Id} not found`,
  });
}
//list all reservations or list filtered by phone number or date
async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const reservation_id = req.query.reservation_id;
  let data;
  if (mobile_number) {
    data = await reservationsService.search(req.query.mobile_number);
    res.status(200).json({ data });
  } else if (date) {
    data = await reservationsService.listByResoDate(req.query.date);
    res.status(200).json({ data });
  } else if (reservation_id){
    data = await reservationsService.read(req.query.reservation_id);
    res.status(200).json({ data });
  } else {
    data = await reservationsService.list();
    res.status(200).json({ data });
  }
}
//create a new reservation
async function create(req, res, next) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}
//update reservation status as table is seated and cleared
async function updateReservationStatus(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await reservationsService.updateResoStatus(
    reservation_id,
    status
  );
  res.json({ data });
}
//update reservation information
async function updateReservation(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const updatedReso = { ...req.body.data, reservation_id };
  const data = await reservationsService.updateReso(updatedReso);
  res.status(200).json({ data });
}
//delete reservation
async function destroy(req, res) {
  const { reservation } = res.locals;
  await reservationsService.destroy(reservation.reservation_id);
  res.sendStatus(204);
}
//get reservation data and set res.locals
async function readReservation(req, res, next) {
  const { reservation } = res.locals;
  const data = await reservationsService.read(reservation.reservation_id);
  res.status(200).json({ data });
}

module.exports = {
  get: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(readReservation),
  ],
  list: asyncErrorBoundary(list),
  post: [
    hasRequiredProperties,
    isValidDateFormat,
    isNotATuesday,
    reservationNotInPast,
    reservationIsDuringBusinessHours,
    reservationIsEarlierToday,
    isValidTimeFormat,
    isPartyValid,
    reservationAlreadyExists,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    reservationStatusCheck,
    reservationIsFinished,
    asyncErrorBoundary(updateReservationStatus),
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    isValidDateFormat,
    isNotATuesday,
    reservationNotInPast,
    reservationIsDuringBusinessHours,
    reservationIsEarlierToday,
    isValidTimeFormat,
    isPartyValid,
    reservationAlreadyExists,
    asyncErrorBoundary(updateReservation),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
