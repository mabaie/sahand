"use strict";
const authorization = require("../../../../middlewares/authorization");
const managerAuthorization = require("../../../../services/authorizators/manager");
const appValidator = require("../../../../middlewares/appValidator");
const addAppointmentController = require("../../../../controllers/add/Appointment");
const addAppointmentValidator = require("../../../../validators/addAppointment");
const addAppointmentError = require("../../../../controllers/Error/addAppointment");
const getAppointmentController = require("../../../../controllers/get/Appointment");
const delAppointmentController = require("../../../../controllers/delete/Appointment");
const router = require("express").Router();
router.post(
  "/appointment/add",
  authorization(managerAuthorization),
  appValidator(addAppointmentValidator, addAppointmentError),
  addAppointmentController
);
router.get(
  "/appointment/get/:date",
  authorization(managerAuthorization),
  getAppointmentController
)
router.delete(
  "/appointment/delete",
  authorization(managerAuthorization),
  delAppointmentController
)
module.exports = router;
