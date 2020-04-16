'use strict';
const router = require('express').Router();
const bearerExtractor = require('../../../../middlewares/bearerExtractor');
const appValidator = require('../../../../middlewares/appValidator');
const loginController = require('../../../../controllers/app/loginController');
const loginValidator = require('../../../../validators/login');
const loginErrorHandler = require('../../../../controllers/Error/login');
const authorization = require('../../../../middlewares/authorization');
const userAuthorization = require('../../../../services/authorizators/user');
const teacherAuthorization = require('../../../../services/authorizators/teacher');
const parentAuthorization = require('../../../../services/authorizators/parent');
const chngPswdValidator = require('../../../../validators/changePassword');
const chngPswdErrorHandler = require('../../../../controllers/Error/changePassword');
const chngPswdController = require('../../../../controllers/update/password');
const parentOrTeacherAuthorization = require('../../../../services/authorizators/parentOrTeacher');
const assignmentUploader = require('../../../../middlewares/assignmentUploader');
const addAssignmentController = require('../../../../controllers/app/post/assignment');
const getAssignmentController = require('../../../../controllers/app/get/assignments');

const teacherRouter = require('./teacher');
const parentRouter = require('./parent');

router.post('/login', bearerExtractor, appValidator(loginValidator, loginErrorHandler), loginController);
router.post('/change-password', authorization(userAuthorization), appValidator(chngPswdValidator, chngPswdErrorHandler), chngPswdController);
router.post(
    "/assignment/:courseID",
    authorization(teacherAuthorization),
    addAssignmentController
  );
router.get("/assignments/:courseID",
authorization(parentOrTeacherAuthorization), getAssignmentController);
router.use('/teacher', teacherRouter)
router.use('/parent', authorization(parentAuthorization), parentRouter)

module.exports = router;