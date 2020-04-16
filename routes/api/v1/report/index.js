'use strict'
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const managersValidator = require('../../../../validators/managers');
const managersErrorHandler = require('../../../../controllers/Error/managers');
const getReportsController = require('../../../../controllers/get/reports');
const deleteManagerValidator = require('../../../../validators/deleteManager');
const deleteManagerErrorHandleer = require('../../../../controllers/Error/deleteManager');
const deleteReportController = require('../../../../controllers/delete/schoolReport');
const router = require('express').Router();
router.post('/reportes', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getReportsController);
router.delete('/reporte', authorization(managerAuthorization), appValidator(deleteManagerValidator, deleteManagerErrorHandleer), deleteReportController);
module.exports = router;
