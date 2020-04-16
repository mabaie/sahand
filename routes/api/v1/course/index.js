'use strict';
const router = require('express').Router();
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const addCourseController = require('../../../../controllers/add/course');
const getCoursesController = require('../../../../controllers/get/courses');
const managersValidator = require('../../../../validators/managers.js');
const managersErrorHandler = require('../../../../controllers/Error/managers');
const deleteManagerValidator = require('../../../../validators/deleteManager');
const deleteManagerErrorHandleer = require('../../../../controllers/Error/deleteManager');
const deleteCourseController = require('../../../../controllers/delete/course');
const postStudentToCourseController = require('../../../../controllers/add/studentToCourse');
const deleteCourseStudentsController = require('../../../../controllers/delete/courseStudents');
const absenceCourseController = require('../../../../controllers/add/attendance');
const absenceCourseValidator = require('../../../../validators/absenceManager');
const absenceCourseErrorHandleer = require('../../../../controllers/Error/attendanceManager');
const attendanceReportController = require('../../../../controllers/get/attendanceReport');
const attendanceReportMonthController = require('../../../../controllers/get/attendanceReportMonth');
const managerOrTeacherAuthorization = require('../../../../services/authorizators/managerOrTeacher');
const mongoIdValidator = require('../../../../middlewares/mongoIdValidator');
const dateValidator = require('../../../../middlewares/dateValidator');
const monthSchoolAbscenceController = require('../../../../controllers/get/schoolMonthAbscence');
const yearSchoolAbscenceController = require('../../../../controllers/get/schoolYearAbscence');

router.post('/course', authorization(managerAuthorization), addCourseController);
router.post('/courses', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getCoursesController);
router.post('/course/students/:id', authorization(managerAuthorization), postStudentToCourseController );
router.delete('/course/:id/students', authorization(managerAuthorization), deleteCourseStudentsController);
router.delete('/course', authorization(managerAuthorization), appValidator(deleteManagerValidator, deleteManagerErrorHandleer), deleteCourseController);
router.post('/attendance/:course_id',authorization(managerAuthorization),appValidator(absenceCourseValidator, absenceCourseErrorHandleer),absenceCourseController)
router.get('/attendance-report/:course_id/:date',authorization(managerAuthorization), attendanceReportController);
router.get('/attendance-report-month/:course_id/:date',authorization(managerAuthorization), attendanceReportMonthController);
router.get('/course/absence-mounth/:id/:date', authorization(managerOrTeacherAuthorization), mongoIdValidator, dateValidator, monthSchoolAbscenceController);
router.get('/course/absence-year/:id/:date', authorization(managerOrTeacherAuthorization), mongoIdValidator, dateValidator, yearSchoolAbscenceController);

module.exports = router;