'use strict';
const router = require('express').Router();
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const addClassValidator = require('../../../../validators/addClass');
const addClassErrorHandler = require('../../../../controllers/Error/addClass');
const addClassController = require('../../../../controllers/add/class');
const getClassesListController = require('../../../../controllers/get/classesList');
const getClassesController = require('../../../../controllers/get/classes');
const managersValidator = require('../../../../validators/managers.js');
const managersErrorHandler = require('../../../../controllers/Error/managers');
const deleteManagerValidator = require('../../../../validators/deleteManager');
const deleteManagerErrorHandleer = require('../../../../controllers/Error/deleteManager');
const deleteClassController = require('../../../../controllers/delete/class');
const updateClassValidator = require('../../../../validators/updateClass');
const updateClassErrorHandler = require('../../../../controllers/Error/updateClass');
const updateClassController = require('../../../../controllers/update/class');
const postStudentToAllCourseController = require('../../../../controllers/add/studentToAllCourse');
const mongoIdValidator = require('../../../../middlewares/mongoIdValidator');
const dateValidator = require('../../../../middlewares/dateValidator');
const getDayAbscentList = require('../../../../controllers/get/dayAbscentList');
const getMonthAbscentController = require('../../../../controllers/get/monthAbscentReport');
const getYearAbscentController = require('../../../../controllers/get/yearAbscentReport');

router.post('/class', authorization(managerAuthorization), appValidator(addClassValidator, addClassErrorHandler), addClassController);
router.post('/classes', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getClassesController);
router.patch('/class/:id', authorization(managerAuthorization), appValidator(updateClassValidator, updateClassErrorHandler), updateClassController);
router.get('/classes', authorization(managerAuthorization), getClassesListController);
// router.get('/student/:id', authorization(managerAuthorization), idValidator, getStudentController);

router.delete('/classe', authorization(managerAuthorization), appValidator(deleteManagerValidator, deleteManagerErrorHandleer), deleteClassController);
router.post('/class/students/:id', authorization(managerAuthorization), postStudentToAllCourseController );
router.get('/class/absence-day/:id/:date', authorization(managerAuthorization),mongoIdValidator, dateValidator, getDayAbscentList);
router.get('/class/abscence-month/:id/:date', authorization(managerAuthorization), mongoIdValidator, dateValidator, getMonthAbscentController);
router.get('/class/abscence-year/:id/:date', authorization(managerAuthorization), mongoIdValidator, dateValidator, getYearAbscentController);

module.exports = router;