'use strict';

const router = require('express').Router();
const bearerExtractor = require('../../../../middlewares/bearerExtractor');
const signUpController = require('../../../../controllers/auth/signup');
const appValidator = require('../../../../middlewares/appValidator');
const signUpValidator = require('../../../../validators/signup');
const signUpErrorHandler = require('../../../../controllers/Error/signup');

const loginValidator = require('../../../../validators/login');
const loginErrorHandler = require('../../../../controllers/Error/login');
const loginController = require('../../../../controllers/auth/login');
const authorization = require('../../../../middlewares/authorization');
const userAuthorization = require('../../../../services/authorizators/user');
const chngPswdValidator = require('../../../../validators/changePassword');
const chngPswdErrorHandler = require('../../../../controllers/Error/changePassword');
const chngPswdController = require('../../../../controllers/update/password');
const chngPswdRSTController = require('../../../../controllers/add/resetAllPasword');
const managerAuthoritator = require('../../../../services/authorizators/manager');

router.post('/signup',bearerExtractor, appValidator(signUpValidator, signUpErrorHandler), signUpController);
router.post('/login', bearerExtractor, appValidator(loginValidator, loginErrorHandler), loginController);
router.post('/change-password', authorization(userAuthorization), appValidator(chngPswdValidator, chngPswdErrorHandler), chngPswdController );
router.get('/reset-all-password',authorization(managerAuthoritator),chngPswdRSTController)
module.exports = router;
