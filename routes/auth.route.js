const express = require('express');
const router = express.Router();

const {
  validRegister, validLogin, validForgotPassword, validResetPassword
} = require('../helpers/valid');

const {
  registerForAdminApproovalController, activationbyAdminController, getActivationLinkNotificationController, getActivationLinkController, loginController, changePasswordController, registerNewAdminController, isUserEmptyController, cancelActivationLinkController
} = require('../controller/auth.controller.js');



router.post('/register', registerForAdminApproovalController)
//router.post('/register',validRegister,registerController)
router.post('/activate', activationbyAdminController)
router.post('/cancel', cancelActivationLinkController)
router.post('/getforactivation', getActivationLinkController)
router.post('/notify', getActivationLinkNotificationController)
router.post('/login', loginController)
router.post('/changepassword', changePasswordController)
router.post('/registernewadmin', registerNewAdminController)
router.get('/userisempty', isUserEmptyController)




module.exports = router