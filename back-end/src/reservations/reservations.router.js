/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list).post(controller.post).all(methodNotAllowed);
router.route("/:reservation_Id").get(controller.get).put(controller.updateReservation).delete(controller.delete).all(methodNotAllowed);
router.route("/:reservation_Id/status").put(controller.updateStatus).all(methodNotAllowed);



module.exports = router;
