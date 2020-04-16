'use strict';
const managerAthorization = require('../../../../services/authorizators/manager');
const authorization = require('../../../../middlewares/authorization');
const appValidator = require('../../../../middlewares/appValidator');
const addParentValidator = require('../../../../validators/addParent');
const addParentErrorHandler = require('../../../../controllers/Error/addParent');
const addParentController = require('../../../../controllers/add/parent');
const idValidator = require('../../../../middlewares/idValidator');
const getParentController = require('../../../../controllers/get/parent');
const updateParentValidator = require('../../../../validators/updateParent');
const updateParentErrorHandler = require('../../../../controllers/Error/updateParent');
const updateParentController = require('../../../../controllers/update/parent');

const router = require('express').Router();
router.post('/parent', authorization(managerAthorization), appValidator(addParentValidator, addParentErrorHandler), addParentController);
router.get('/parent/:id', authorization(managerAthorization), idValidator, getParentController);
router.patch('/parent/:id', authorization(managerAthorization), appValidator(updateParentValidator, updateParentErrorHandler), updateParentController);
module.exports = router;
