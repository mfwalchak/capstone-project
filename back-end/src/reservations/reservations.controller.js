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
  console.log("isValidDateFormat:", date, typeof(date))
  console.log("testing REGEX validation:", /\d\d\d\d-\d\d-\d\d/.test(date))
  try{
    if (!/\d\d\d\d-\d\d-\d\d/.test(date)){
        const error = new Error("reservation_date");
        error.message = "invalid reservation_date";
        error.status = 400;
        throw error;
    } next();
  } catch(error) {
    next(error);
  }
}

function isNotATuesday(req, res, next){
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let day = new Date(`${data.reservation_date} ${data.reservation_time}`)
  //console.log("isNotATuesdayValidator")
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
  //console.log("reservationNotInPastValidator")
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let time = data.reservation_time;
  let day = new Date(`${data.reservation_date} ${data.reservation_time}`)

  try {
    let now = new Date();
    // console.log("notInPast", day.getDate(), now.getDate())
    if (day < now) {
      //console.log("Inside the NotInPast Condition!")//check if date is in the past
      const error = new Error(`${date}`);
      error.message="reservation must be in the future";
      error.status = 400;
      throw error;
    } next();
  } catch(error) {
    next(error);
  }
}

function reservationIsDuringBusinessHours(req, res, next){
  let { data = {} } = req.body;
  let date = data.reservation_date;
  let time = data.reservation_time;
  // const d930 = new Date(2022, 01, 20, 21, 30, 0, 0).getTime();
  // const d1030 = new Date(2022, 01, 20, 10, 30, 0, 0).getTime();
  // console.log(d930, d1030);
  // console.log(Date.now())
  // console.log(time);
  //reservations can only be created up to 60 minutes before closing
  //if reservation is before 10:30 am
  try{
    if (time < "10:30" || time >= "21:30"){
      const error = new Error(`${time}`);
      error.message="reservation_time is invalid";
      error.status = 400;
      throw error;
    } next();
  } catch(error) {
    next(error);
  }
}

function reservationIsEarlierToday(req, res, next) {
  let { data = {} } = req.body;
  let time = data.reservation_time;
  let now = new Date();
  //console.log("reservationEarlierTodayValidation")
  //console.log(time, `${now.getHours()}:${now.getMinutes()}`)
  try{
    if (time < now){
      const error = new Error(`${time}`);
      error.message="Reservation must be for a time in the future";
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

async function reservationExists(req, res, next){
  //console.log("reservationExists:", req.params)
  const data = await reservationsService.read(req.params.reservation_Id);
  res.status(200).json({ data })
}


async function list(req, res) {
  const { mobile_number } = req.query;
  let data;
  if ( mobile_number ) {
    data = await reservationsService.search(req.query.mobile_number);
    res.status(200).json({ data })
  }
  //console.log("reservationsLIST req.query.date", req.query.date);
  data = await reservationsService.list(req.query.date);
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

// async function search(req, res, next) {
//   console.log("ControllerSEARCH:", req.query);
//   const data = await reservationsService.search(req.query.mobile_number);
//   res.status(200).json({ data });
// }

module.exports = {
  get: asyncErrorBoundary(reservationExists),
  list: asyncErrorBoundary(list),
  post: [
    hasRequiredProperties, 
    isValidDateFormat, 
    isNotATuesday, 
    reservationNotInPast,
    reservationIsDuringBusinessHours,
    reservationIsEarlierToday,
    isValidTimeFormat, 
    isPartyValid, asyncErrorBoundary(create)],
  //search: asyncErrorBoundary(search)
};
