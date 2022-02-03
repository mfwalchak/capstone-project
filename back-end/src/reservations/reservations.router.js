/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list).post(controller.post);
router.route("/:reservation_Id").get(controller.get).put(controller.updateReservation).delete(controller.delete);
router.route("/:reservation_Id/status").put(controller.updateStatus);



module.exports = router;
