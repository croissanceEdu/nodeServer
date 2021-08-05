const router = require("express").Router();

const { getOrder, getShedules, getHistory, addNewShedule, deleteShedule, addRecord, approveRecord, rejectRecord, getRequests } = require("../controller/payment.controller");

router.post("/order", getOrder);
router.post("/getshedules", getShedules);
router.post("/gethistory", getHistory);
router.post("/getrequest", getRequests);
router.post("/addschedule", addNewShedule);
router.delete("/schedule/:id", deleteShedule);
router.post("/addrecord", addRecord);
router.post("/approverecord", approveRecord);
router.post("/rejectrecord", rejectRecord);
module.exports = router