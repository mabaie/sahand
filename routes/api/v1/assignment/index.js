'use strict';
const router = require('express').Router();
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');

//const assignmentUploader = require('../../../../middlewares/assignmentUploader');
const addAssignmentController = require('../../../../controllers/app/post/assignment');
const getAssignmentController = require('../../../../controllers/app/get/assignments');
const updateAssignmentController = require('../../../../controllers/update/assinment');
const deleteAssignmentController = require('../../../../controllers/delete/assinment');

router.post(
    "/assignment/:courseID",
    authorization(managerAuthorization),
    //assignmentUploader,
    addAssignmentController
  );
router.get("/assignments/:courseID",
    authorization(managerAuthorization), getAssignmentController);

router.put("/update-assignment/:courseID",
    authorization(managerAuthorization),
    //assignmentUploader, 
    updateAssignmentController);
router.delete("/delete-assignment/:courseID",
    authorization(managerAuthorization),
    //assignmentUploader, 
    deleteAssignmentController);
module.exports = router;