/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

 const router = require("express").Router();
 const controller = require("./tables.controller");
 
 router.route("/").get(controller.list).post(controller.post); //this will fail tests need everything routed off /
 
 
 
 module.exports = router;