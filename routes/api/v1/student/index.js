'use strict';
const router = require('express').Router();
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const addStudentValidator = require('../../../../validators/addStudent');
const addStudentErrorHandler = require('../../../../controllers/Error/addStudent');
const addStudentController = require('../../../../controllers/add/student');
const idValidator = require('../../../../middlewares/idValidator');
const getStudentController = require('../../../../controllers/get/student');
const getStudentsController = require('../../../../controllers/get/students');
const managersValidator = require('../../../../validators/managers.js');
const managersErrorHandler = require('../../../../controllers/Error/managers');
const deleteManagerValidator = require('../../../../validators/deleteManager');
const deleteManagerErrorHandleer = require('../../../../controllers/Error/deleteManager');
const deleteStudentController = require('../../../../controllers/delete/student');
const updateStudentValidator = require('../../../../validators/updateStudent');
const updateStudentErrorHandler = require('../../../../controllers/Error/updateStudent');
const updateStudentController = require('../../../../controllers/update/student');
const getStudentsListController = require('../../../../controllers/get/getStudentsList');
const getSchoolStudentsListController = require('../../../../controllers/get/getSchoolStudentsListController');
const getSchoolStudentsListOfGradeClassController = require('../../../../controllers/get/getSchoolStudentsGradeListController');
const getStudentReportController = require('../../../../controllers/get/studentReportList');
const getStudentReportValidator = require('../../../../validators/studentReport');
const getStudentReportErrorController = require('../../../../controllers/Error/studentReport');

router.post('/student', authorization(managerAuthorization), appValidator(addStudentValidator, addStudentErrorHandler), addStudentController);
router.post('/students', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getStudentsController);
router.patch('/student/:id', authorization(managerAuthorization), appValidator(updateStudentValidator, updateStudentErrorHandler), updateStudentController);
router.get('/student/:id', authorization(managerAuthorization), idValidator, getStudentController);
router.get('/students/:id', authorization(managerAuthorization), getStudentsListController);
router.get('/sstudents/:id', authorization(managerAuthorization), getSchoolStudentsListController);
router.get('/sstudents-grade/:id', authorization(managerAuthorization), getSchoolStudentsListOfGradeClassController);
router.delete('/student', authorization(managerAuthorization), appValidator(deleteManagerValidator, deleteManagerErrorHandleer), deleteStudentController);
router.post('/student-report',authorization(managerAuthorization),appValidator(getStudentReportValidator,getStudentReportErrorController),getStudentReportController)

module.exports = router;