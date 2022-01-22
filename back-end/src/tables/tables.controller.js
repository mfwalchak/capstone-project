const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");

async function list(req, res) {
    //console.log("backend Req Date:", req.query.date);
    const data = await tablesService.list(req.query.date);
    res.status(200).json({ data });
  }
  
  async function create(req, res, next) {
    console.log("controllerCreateReq:", req.body);
    const data = await tablesService.create(req.body.data);
    console.log("controllerCreateResponse:", data);
    res.status(201).json({ data });
  }

  module.exports = {
      list: asyncErrorBoundary(list),
      post: asyncErrorBoundary(create)
  };