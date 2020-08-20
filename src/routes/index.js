const {Router} = require('express');
const router = Router();
const {TokenValidation} = require('../middleware/verifyToken');

//controllers
const {signUp, signIn,signAnyUser} = require('../controllers/auth.controller');
const {createBucket,getAllBucket} = require('../controllers/bucket.controller');
const {RegisterUserRed,getSponsorForPay,getTreeMatrix} = require('../controllers/matrix.controller');
const {VerifyPay} = require('../controllers/validatepay.controller');
const {GetProfits} = require('../controllers/user.controller');

//users route
router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);
router.post('/auth/withid/signin', signAnyUser);
router.get('/user/profits', TokenValidation, GetProfits);
router.get('/user/profits/:id', GetProfits);

//bucket route
router.post('/bucket/create', TokenValidation,createBucket);
router.get('/bucket/getAll/:userid', getAllBucket);

//matrix route
router.post('/matrix/join_red', TokenValidation,RegisterUserRed);
router.get('/matrix/sponsors/:bucket', TokenValidation,getSponsorForPay);
router.get('/matrix/tree/:userid',getTreeMatrix);

//validate pay
router.post('/transaction/validate', TokenValidation, VerifyPay);

module.exports = router;


