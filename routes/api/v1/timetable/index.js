'use strict';
const router = require('express').Router();
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const getTimetableController = require('../../../../controllers/get/timetable');
const updateTimeTableController = require('../../../../controllers/update/timetable');
const parentAuthorization = require('../../../../services/authorizators/parent');
const getStudentTimetableController = require('../../../../controllers/get/studentTimetable');
router.get('/timetable/:id', authorization(managerAuthorization), getTimetableController);
router.get('/student-timetable/:id', authorization(parentAuthorization), getStudentTimetableController);
router.patch('/timetable/:id', authorization(managerAuthorization), updateTimeTableController);
module.exports = router;