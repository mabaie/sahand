'use strict'
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const managersValidator = require('../../../../validators/managers');
const managersErrorHandler = require('../../../../controllers/Error/managers');
const getMagazinesController = require('../../../../controllers/get/magazines');
const deleteManagerValidator = require('../../../../validators/deleteManager');
const deleteManagerErrorHandleer = require('../../../../controllers/Error/deleteManager');
const deleteMagazineController = require('../../../../controllers/delete/schoolMagazin');
const router = require('express').Router();
router.post('/magazines', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getMagazinesController);
router.delete('/magazine', authorization(managerAuthorization), appValidator(deleteManagerValidator, deleteManagerErrorHandleer), deleteMagazineController);
module.exports = router;
