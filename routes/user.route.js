const router = require('express').Router();
// const { Mongoose } = require('mongoose');
const { classLinkController, getUsersController, getUsersByIdController, getUserPairController,
    setProfilePicByIdController, getUserDetailsByIdController,
    setUserProfileByIdController, clearProfilePicByIdController,
    getNotificationController } = require('../controller/user.controller');


router.post('/classlink', classLinkController);
router.post('/get', getUsersController);
router.post('/getpair', getUserPairController);
router.post('/getbyid', getUsersByIdController);
router.post('/updatepic/:id', setProfilePicByIdController);
router.post('/removepic', clearProfilePicByIdController);
router.post('/getdetails', getUserDetailsByIdController);
router.post('/updateprofile', setUserProfileByIdController);
router.post('/notify', getNotificationController);



//for test

// router.get('/users',(req, res) => {
//     User.find()
//       .then(user => res.json(user))
//       .catch(err => res.status(400).json('Error: ' + err));
//   });
//

module.exports = router
