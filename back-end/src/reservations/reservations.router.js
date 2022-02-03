/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
//const { route } = require("../app");
const controller = require("./reservations.controller");
//const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/").get(controller.list).post(controller.post); //this will fail tests need everything routed off /
router.route("/:reservation_Id").get(controller.get).put(controller.updateReservation).delete(controller.delete);
router.route("/:reservation_Id/status").put(controller.updateStatus);



module.exports = router;
