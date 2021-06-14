const router = require("express").Router();

const { getOrder, getShedules, addNewShedule } = require("../controller/payment.controller");

router.post("/order", getOrder);
router.post("/getshedules", getShedules);
router.post("/addschedule", addNewShedule);

module.exports = router