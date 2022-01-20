const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("first_name","last_name","mobile_number","reservation_date","reservation_time","people");
const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

// function formatAsDate(dateString) {
//   return dateString.match(dateFormat);
// }

function isValidDateFormat(req, res, next){
  let { data = {} } = req.body;
  let date = data.reservation_date;
  try{
    if (!/\d\d\d\d-\d\d-\d\d/.test(date)){
        const error = new Error("reservation_date");
        error.status = 400;
    } next();
  } catch(error) {
    next(error);
  }
}

function isNotATuesday(req, res, next){
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let day = new Date(`${data.reservation_date} ${data.reservation_time}`)
  console.log("isNotATuesdayValidator")
  try{
    if (day.getDay() === 2) {
      const error = new Error(`${date}`);
      error.message="closed";
      error.status = 400;
      throw error;
    } next();
  } catch(error) {
    next(error);
  }
}

function reservationNotInPast(req, res, next){
  console.log("reservationNotInPastValidator")
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let day = new Date(`${data.reservation_date} ${data.reservation_time}`)

  try {
    console.log("reservationPastValidation")
    if (day < new Date()) {
      //console.log("Inside the NotInPast Condition!")//check if date is in the past
      const error = new Error(`${date}`);
      error.message="future";
      error.status = 400;
      throw error;
    } next();
  } catch(error) {
    next(error);
  }
} 

function isValidTimeFormat(req, res, next){
  let { data = {} } = req.body;
  let time = data.reservation_time;
  //console.log("time", time);
  try{
    if (!/\d\d:\d\d/.test(time)){
        const error = new Error("reservation_time");
        error.message="Time Validation Error";
        error.status = 400;
        throw error;
    } next();
  } catch(error) {
    next(error);
  }
}

function isPartyValid(req, res, next){
  let{ data = {} } = req.body;
  let party = data.people;
  try{
    if (typeof(party) != "number") {
      let error = new Error(`people must be a number.`)
      error.status = 400;
      throw error;
    } next();
  } catch (error) {
    next(error);
  }
}


async function list(req, res) {
  //console.log("backend Req Date:", req.query.date);
  const data = await reservationsService.list(req.query.date);
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  post: [hasRequiredProperties, isValidDateFormat, isNotATuesday, reservationNotInPast, isValidTimeFormat, isPartyValid, asyncErrorBoundary(create)],
};
