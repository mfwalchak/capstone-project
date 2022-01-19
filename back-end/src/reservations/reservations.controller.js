const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("first_name","last_name","mobile_number","reservation_date","reservation_time","people");

function isValidDateFormat(req, res, next){
  const { data = {} } = req.body;
  const date = data.reservation_date;
  try{
    if (date instanceof Date && !isNaN(date)) {
      const error = new Error(`${date} must be YYYY-MM-DD.`)
      error.status = 400;
      throw error;
    } next();
  } catch (error) {
    next(error);
  }
}

function isPartyValid(req, res, next){
  const { data = {} } = req.body;
  const party = data.people;
  try{
    if (isNaN(party)) {
      const error = new Error(`${party} must be a number.`)
      error.status = 400;
      throw error;
    } next();
  } catch (error) {
    next(error);
  }
}


async function list(req, res) {
  console.log(req.query.date);
  const data = await reservationsService.list(req.query.date);
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  post: [hasRequiredProperties, isValidDateFormat, isPartyValid, asyncErrorBoundary(create)],
};
