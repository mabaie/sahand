'use strict';
const autorization = require('../../../../middlewares/authorization');
const managerAuthorizator = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const addEventValidator = require('../../../../validators/addEvent');
const addEventErrorHandler = require('../../../../controllers/Error/addEvent');
const addEventController = require('../../../../controllers/add/event');
const getEventController = require('../../../../controllers/get/event');
const deleteEventController = require('../../../../controllers/delete/event');
const deleteEventValidator = require('../../../../validators/deleteEvent');
const deleteEventErrorHandler = require('../../../../controllers/Error/deleteEvent');

const router = require('express').Router();
router.post('/calendar/event', autorization(managerAuthorizator),appValidator(addEventValidator, addEventErrorHandler),addEventController);
router.get('/calendar/events/:date', autorization(managerAuthorizator), getEventController);
router.delete('/calendar/event/:id', autorization(managerAuthorizator), appValidator(deleteEventValidator, deleteEventErrorHandler), deleteEventController);
module.exports = router;