const router = require('express').Router();
const { Mongoose } = require('mongoose');
const { classLinkController, getUsersController, getUsersByIdController, getUserPairController, setProfilePicByIdController } = require('../controller/user.controller');

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })



router.post('/classlink', classLinkController);
router.post('/get', getUsersController);
router.post('/getpair', getUserPairController);
router.post('/getbyid', getUsersByIdController);
router.put('/updatepic/:id', upload.single('productImage'), setProfilePicByIdController);
//for test

// router.get('/users',(req, res) => {
//     User.find()
//       .then(user => res.json(user))
//       .catch(err => res.status(400).json('Error: ' + err));
//   });
//

module.exports = router
