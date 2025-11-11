const express = require('express');
const router = express.Router();

const { getSignup, getHomePage, getSignin, getDashboard,postSignup, postSignin} = require('../controllers/user.controllers');
const port = process.env.PORT || 3600;




router.post('/signup', postSignup);


router.post('/signin', postSignin);


router.get('/dashboard', getDashboard );



router.get('/', getHomePage);

router.get('/signup', getSignup);

router.get('/signin', getSignin);

module.exports = router;
