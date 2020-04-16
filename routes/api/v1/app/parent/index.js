"use strict";
const router = require("express").Router();
const getAttendanceController = require("../../../../../controllers/app/get/attendance");
const getAboutSchoolController = require("../../../../../controllers/get/aboutSchool");
const getSchoolIDofStudent = require("../../../../../middlewares/getSchoolIDofStudent");
const authorization = require('../../../../../middlewares/authorization');
const parentAuthorizator = require('../../../../../services/authorizators/parent');
const getEncourageController = require('../../../../../controllers/app/get/parentEncourages');
const appValidator = require('../../../../../middlewares/appValidator');
const getEncourageParentValidator = require('../../../../../validators/getEncourageParent');
const getEncourageParentErrorController = require('../../../../../controllers/Error/getEncourageParent');
const getNewsesSchoolController = require('../../../../../controllers/app/get/newses')
const getNewsSchoolController = require('../../../../../controllers/app/get/news')
const managersValidator = require('../../../../../validators/managers');
const managersErrorHandler = require('../../../../../controllers/Error/managers');
const getEventSchoolController = require('../../../../../controllers/get/event');
const getGalleryController = require('../../../../../controllers/get/gallery/getGalleryStudentApp');
const getGalleryTagsController = require('../../../../../controllers/get/gallery/getGalleryTagsStudent');
const getGalleryCourseController = require('../../../../../controllers/get/gallery/getGalleryCourseStudent');
const getMagazinesController = require("../../../../../controllers/app/get/magazines");
const getMagazibeSchoolController = require("../../../../../controllers/app/get/magazine");
const getReportsController = require("../../../../../controllers/app/get/reports");
const getReportSchoolController = require("../../../../../controllers/app/get/report");
const homeActivityValidator = require("../../../../../validators/addHomeActivityParent");
const homeActivityErrorHandler = require("../../../../../controllers/Error/addHomeActivityParent");
const addHomeActivityController = require("../../../../../controllers/app/post/homeActivity");
const gethomeActivityListController = require("../../../../../controllers/app/get/homeActivityList");
const getChiledListController = require("../../../../../controllers/app/get/getChiledList");
const getAppointmentController = require('../../../../../controllers/app/get/Appointment');
const setAppointmentController = require('../../../../../controllers/app/post/Appointment');
const appointmentValidator = require('../../../../../validators/setAppointment');
const appointmentErrorHandler = require('../../../../../controllers/Error/setAppointment');
const rmAppointmentController = require('../../../../../controllers/app/post/CancelAppointment');

const getContactListValidator = require('../../../../../validators/getContactList');
const getContactListErrorHandler = require('../../../../../controllers/Error/getContactList');
const getContactListController = require('../../../../../controllers/get/contactList');
const getParentAbscentMonthController = require('../../../../../controllers/app/get/parentAbscentMonth');
const mongoIdValidator = require('../../../../../middlewares/mongoIdValidator');
const dateValidator = require('../../../../../middlewares/dateValidator');
router.get("/attendance/:id", getAttendanceController);
router.get(
  "/school/about/:id",
  getSchoolIDofStudent,
  getAboutSchoolController
);

router.get(
  "/school/events/:id/:date",
  getSchoolIDofStudent,
  getEventSchoolController
);

router.post(
  "/school/newses/:id",
  getSchoolIDofStudent,appValidator(managersValidator, managersErrorHandler),
  getNewsesSchoolController
);
router.get(
  "/school/news/:news_id",
  authorization(parentAuthorizator),
  getNewsSchoolController
);
router.post('/school/magazines/:id', 
  getSchoolIDofStudent,
  appValidator(managersValidator, managersErrorHandler),
  getMagazinesController);
router.get(
  "/school/magazine/:id",
  authorization(parentAuthorizator),
  getMagazibeSchoolController
);
router.post('/school/reports/:id', 
  getSchoolIDofStudent,
  appValidator(managersValidator, managersErrorHandler),
  getReportsController);
router.get(
  "/school/report/:id",
  authorization(parentAuthorizator),
  getReportSchoolController
);
router.post(
  "/gallery/:id",
  authorization(parentAuthorizator),
  getSchoolIDofStudent,
  appValidator(managersValidator, managersErrorHandler),
  getGalleryController
);
router.post(
  "/gallery/:id/:courseID",
  authorization(parentAuthorizator),
  getSchoolIDofStudent,
  appValidator(managersValidator, managersErrorHandler),
  getGalleryController
);
router.get(
    "/gallery-tag/:id",
    authorization(parentAuthorizator),
    getSchoolIDofStudent,
    getGalleryTagsController
  );
  router.get(
    "/gallery-course/:id",
    authorization(parentAuthorizator),
    getSchoolIDofStudent,
    getGalleryCourseController
  );
  router.post(
    "/home-activity/:id",
    authorization(parentAuthorizator),
    appValidator(homeActivityValidator, homeActivityErrorHandler),
    addHomeActivityController
  );
  router.get(
    "/home-activity-list/:id",
    authorization(parentAuthorizator),
    getSchoolIDofStudent,
    gethomeActivityListController
  );
  router.get(
    "/chiled-list",
    authorization(parentAuthorizator),
    getChiledListController
  );
  router.get(
    "/setting-appointment-list/:id/:date",
    authorization(parentAuthorizator),
    getSchoolIDofStudent,
    getAppointmentController
  );
  router.post(
    "/setting-appointment-set",
    authorization(parentAuthorizator),
    appValidator(appointmentValidator, appointmentErrorHandler),
    setAppointmentController
  );
  router.post(
    "/setting-appointment-remove",
    authorization(parentAuthorizator),
    appValidator(appointmentValidator, appointmentErrorHandler),
    rmAppointmentController
  );
  router.post('/chat-contact-list/:id', authorization(parentAuthorizator),getSchoolIDofStudent, appValidator(getContactListValidator, getContactListErrorHandler), getContactListController);
  router.post('/encourage-report',authorization(parentAuthorizator),appValidator(getEncourageParentValidator, getEncourageParentErrorController), getEncourageController)
  router.get('/absence-month/:id/:date', mongoIdValidator, dateValidator, getParentAbscentMonthController);
  module.exports = router;
