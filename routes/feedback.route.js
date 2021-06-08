const router = require('express').Router();
// const { Mongoose } = require('mongoose');
const { getFeedbackNotificationController, getFeedbackController, sendFeedbackController, getUsersWithFeedbackController } = require('../controller/feedback.controller');

router.post('/notify', getFeedbackNotificationController);
router.post('/receive', getFeedbackController);
router.post('/send', sendFeedbackController);
router.post('/users', getUsersWithFeedbackController);


module.exports = router