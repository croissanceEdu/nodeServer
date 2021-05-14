//Validation helper
const {
    check
}=require('express-validator');


//Register
exports.validRegister=[
    check('name','Name is required').isEmpty()
    .isLength({
        min:4,
        max:32
    }).withMessage('name must have 3-32 characters'),
    check('email').isEmpty().withMessage('email must be valid'),
    check('password','password is required').isEmpty()
    .isLength({
        min:6
    }).withMessage('password must contain at least 6 characters'),
]


//Login
exports.validLogin=[
    check('email').isEmpty().withMessage('email must be valid'),
    check('password','password is required').isEmpty()
    .isLength({
        min:6
    }).withMessage('password must contain at least 6 characters')
]

//Forgot password
exports.validForgotPassword=[
    check('email')
    .not()
    .isEmpty()
    .isEmail().withMessage('email must be valid')  
]


//Reset password
exports.validResetPassword=[
    check('newPassword')
    .not()
    .isEmpty()
    .isLength({
        min:6
    }).withMessage('password must contain at least 6 characters'),
   
]