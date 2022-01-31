//const { table, orderBy } = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name","capacity");
const reservationsService = require("../reservations/reservations.service")

async function list(req, res) {
    //console.log("backend Req Date:", req.query.date);
    const data = await tablesService.list();
    res.status(200).json({ data });
  }
  
  async function create(req, res, next) {
    //console.log("controllerCreateReq:", req.body);
    const data = await tablesService.create(req.body.data);
    //console.log("controllerCreateResponse:", data);
    res.status(201).json({ data });
  }

  async function update(req, res, next) {
    console.log("controllerUpdateReq:", req.body, req.params);
    const data = await tablesService.update(req.body.data.reservation_id, req.params.table_id);
    console.log("controllerUpdateResponse:", data);
    res.status(200).json({ data });
  }

  // async function destroy(req, res) {
  //   const { table } = res.locals;
  
  //   await tablesService.clearTable(req.params.table_id, table.reservation_id);
  //   res.status(200).json({});
  // }

  async function reservationExists(req, res, next){
    //console.log("reservationExists:", req.body.data)
    const reservation = await reservationsService.read(req.body.data.reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      //console.log("res.locals", res.locals)
      return next();
    }
    next({ status: 404, message: "999"})
  }
  
  async function tableExists(req, res, next){
    //console.log("tableExists:", req.params.table_id)
    const table = await tablesService.read(req.params.table_id);
    if (table) {
      res.locals.table = table;
      //console.log("res.locals.table", res.locals.table)
      return next();
    }
    next({ status: 404, message: "table not found"})
  }
  

  function isTableNameValid(req, res, next) {
    let { data = {} } = req.body;
    //console.log("isTableNameValid:", data.table_name.length, typeof data.table_name)
    try{
      if (data.table_name.length <= 1){
          const error = new Error("invalid table name");
          error.message="table_name";
          error.status = 400;
          throw error;
      } next();
    } catch(error) {
      next(error);
    }
  }

  function isTableCapacityValid(req, res, next){
    let {data = {} } = req.body;
    //console.log("isTableCapacityValidDATA", data.capacity, typeof(parseInt(data.capacity)))
    try{
      if(data.capacity < 1 || typeof(data.capacity) != "number"){
        const error = new Error("table must seat at least 1");
        error.message="capacity must be a number greater than 0";
        error.status = 400;
        throw error;
      } next();
    } catch(error){
      next(error);
    }
  }

  function isTableBigEnough(req, res, next){
    const people = res.locals.reservation.people;
    const capacity = res.locals.table.capacity;
    //console.log("isTablesBigEnough", people, capacity);
    try{    
      if (people > capacity) {
      const error = new Error("party size exceeds table capacity");
      error.message = `Party size exceeds table capacity`;
      error.status = 400;
      throw error;
      } next();
    } catch(error) {
        next(error)
    }
  }

  function isTableOccupied(req, res, next){
    const { table } = res.locals;
    try{    
      if (table.reservation_id) {
      const error = new Error("table is occupied!");
      error.message = `occupied`;
      error.status = 400;
      throw error;
      } next();
    } catch(error) {
        next(error)
    }
  }
  

  function isReservationValid(req, res, next){
    let {data = {} } = req.body;
    try{
      if(!data || !data.reservation_id){
        const error = new Error("invalid reservation_id");
        error.message="reservation_id";
        error.status = 400;
        throw error;
      } next();
    } catch(error){
      next(error);
    }
  }


  module.exports = {
      list: asyncErrorBoundary(list),
      post: [hasRequiredProperties, isTableNameValid, isTableCapacityValid, asyncErrorBoundary(create)],
      put: [isReservationValid, asyncErrorBoundary(reservationExists), asyncErrorBoundary(tableExists), isTableBigEnough, isTableOccupied, asyncErrorBoundary(update)]
  };