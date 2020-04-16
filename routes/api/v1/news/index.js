'use strict'
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const managersValidator = require('../../../../validators/managers');
const managersErrorHandler = require('../../../../controllers/Error/managers');
const getNewsesController = require('../../../../controllers/get/newses');
const deleteManagerValidator = require('../../../../validators/deleteManager');
const deleteManagerErrorHandleer = require('../../../../controllers/Error/deleteManager');
const deleteNewsController = require('../../../../controllers/delete/schoolNews');
const router = require('express').Router();
router.post('/newses', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getNewsesController);
router.delete('/newse', authorization(managerAuthorization), appValidator(deleteManagerValidator, deleteManagerErrorHandleer), deleteNewsController);
module.exports = router;
