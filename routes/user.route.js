const router = require('express').Router();
const { Mongoose } = require('mongoose');
const { classLinkController, getUsersController, getUsersByIdController, getUserPairController, setProfilePicByIdController } = require('../controller/user.controller');

// const multer = require('multer')
// // const upload = multer({ dest: '../uploads/' })

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, new DataCue().toISOString().file.originalname)
//     }
// })
// const upload = multer({ storage: storage })

router.post('/classlink', classLinkController);
router.post('/get', getUsersController);
router.post('/getpair', getUserPairController);
router.post('/getbyid', getUsersByIdController);
router.post('/updatepic/:id', setProfilePicByIdController);
// router.post('/updatepic/:id', upload.single('profilePicture'), setProfilePicByIdController);

//for test

// router.get('/users',(req, res) => {
//     User.find()
//       .then(user => res.json(user))
//       .catch(err => res.status(400).json('Error: ' + err));
//   });
//

module.exports = router
