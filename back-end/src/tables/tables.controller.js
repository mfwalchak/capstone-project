const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");
const reservationsService = require("../reservations/reservations.service");

//CRUD OPERATIONS
//list all tables
async function list(req, res) {
  const data = await tablesService.list();
  res.status(200).json({ data });
}
//create new tables
async function create(req, res, next) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}
//update table foreign key reservation_id, controls whether table appears as "seated"
async function update(req, res, next) {
  const data = await tablesService.update(
    req.body.data.reservation_id,
    req.params.table_id
  );
  res.status(200).json({ data });
}
//update table reservation_id, clears the table to be reseated
async function destroy(req, res) {
  const { table } = res.locals;
  await tablesService.clearTable(table.reservation_id);
  res.status(200).json({});
}
//verify reservation exists and set res.locals
async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(
    req.body.data.reservation_id
  );
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation ${req.body.data.reservation_id} not found`,
  });
}
//verify table exists and set res.locals
async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `table ${req.params.table_id} not found` });
}

//VALIDATION functions
//validates table name is a string at least 2 characters long
function isTableNameValid(req, res, next) {
  let { data = {} } = req.body;
  try {
    if (data.table_name.length <= 1) {
      const error = new Error("invalid table name");
      error.message = "table_name";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validates a new table has a capacity that is a number greater than 0
function isTableCapacityValid(req, res, next) {
  let { data = {} } = req.body;
  try {
    if (data.capacity < 1 || typeof data.capacity != "number") {
      const error = new Error("table must seat at least 1");
      error.message = "capacity must be a number greater than 0";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validates table is large enough to seat party
function isTableBigEnough(req, res, next) {
  const people = res.locals.reservation.people;
  const capacity = res.locals.table.capacity;
  try {
    if (people > capacity) {
      const error = new Error("party size exceeds table capacity");
      error.message = `Party size exceeds table capacity`;
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validates if table is occupied before seating
function isTableOccupied(req, res, next) {
  const { table } = res.locals;
  try {
    if (table.reservation_id) {
      const error = new Error("table is occupied!");
      error.message = `occupied`;
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validates table is unoccupied before attempting to clear
function isTableUnoccupied(req, res, next) {
  const { table } = res.locals;
  try {
    if (!table.reservation_id) {
      const error = new Error("table is already cleared");
      error.message = `table is not occupied`;
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}
//validates reservation_id is connected to a current reservation
function isReservationValid(req, res, next) {
  let { data = {} } = req.body;
  try {
    if (!data || !data.reservation_id) {
      const error = new Error("invalid reservation_id");
      error.message = "reservation_id";
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  post: [
    hasRequiredProperties,
    isTableNameValid,
    isTableCapacityValid,
    asyncErrorBoundary(create),
  ],
  put: [
    isReservationValid,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    isTableBigEnough,
    isTableOccupied,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isTableUnoccupied,
    asyncErrorBoundary(destroy),
  ],
};
