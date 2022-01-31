/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list).post(controller.post); //this will fail tests need everything routed off /
router.route("/:reservation_Id").get(controller.get);


module.exports = router;
