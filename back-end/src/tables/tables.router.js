/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

 const router = require("express").Router();
 const controller = require("./tables.controller");
 const methodNotAllowed = require("../errors/methodNotAllowed");

 router.route("/").get(controller.list).post(controller.post).all(methodNotAllowed);
 router.route("/:table_id/seat").put(controller.put).delete(controller.delete).all(methodNotAllowed);
 
 
 
 module.exports = router;