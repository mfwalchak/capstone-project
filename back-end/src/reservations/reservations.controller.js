const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");


async function list(req, res) {
  const data = await reservationsService.list();
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  post: asyncErrorBoundary(create),
};
