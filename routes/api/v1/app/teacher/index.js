'use strict';

const router = require('express').Router();
const authorization = require('../../../../../middlewares/authorization');
const studentListController = require('../../../../../controllers/app/get/appStudentList');
const teacherAuthorizator = require('../../../../../services/authorizators/teacher');
const appValidator = require('../../../../../middlewares/appValidator');
const getStudentListValidator = require('../../../../../validators/appStudentList');
const getStudentListErrorHandler = require('../../../../../controllers/Error/appStudentList');
const postAttendanceValidator = require('../../../../../validators/appPostAttendance');
const postAttendanceErrorHandler = require('../../../../../controllers/Error/appPostAttendance');
const postAttendanceController = require('../../../../../controllers/app/post/attendance');
const getAboutSchoolController = require("../../../../../controllers/get/aboutSchool");
const everyoneAuthorization = require("../../../../../services/authorizators/parentSchool");
const getTeacherEncourageList = require('../../../../../controllers/app/get/teacherEncourages');
const addEncourageTeacherErrorHandler = require('../../../../../controllers/Error/addEncourageTeacher');
const addEncourageTeacherValidator = require('../../../../../validators/addEncourageTeacher');
const addEncourageTeacherController = require('../../../../../controllers/add/encourageTeacher');
const getNewsesSchoolController = require('../../../../../controllers/app/get/newses')
const getNewsSchoolController = require('../../../../../controllers/app/get/news')
const managersValidator = require('../../../../../validators/managers');
const managersErrorHandler = require('../../../../../controllers/Error/managers');

const getEventSchoolController = require('../../../../../controllers/get/event');
const getGalleryController = require('../../../../../controllers/get/gallery/getGalleryTeacherApp');
const getGalleryTagsController = require('../../../../../controllers/get/gallery/getGalleryTagsTeacherApp');

const addGalleryController = require('../../../../../controllers/add/appTeacherGalleryImage');
const appValidatorAddGallery = require('../../../../../validators/addGalleryTeacherApp');
const appValidatorErrorGallery = require('../../../../../controllers/Error/addGalleryManager');

const uploader = require("../../../../../middlewares/uploader");
const uploadResp = require("../../../../../controllers/add/uploadFile");
const getMagazinesController = require("../../../../../controllers/app/get/magazines");
const getmagazineSchoolController = require("../../../../../controllers/app/get/magazine");
const getReportsController = require("../../../../../controllers/app/get/reports");
const getReportSchoolController = require("../../../../../controllers/app/get/report");

const getCourseListController = require("../../../../../controllers/app/get/getCourseList");

const absenceCourseController = require('../../../../../controllers/add/attendance');
const absenceCourseValidator = require('../../../../../validators/absenceManager');
const absenceCourseErrorHandleer = require('../../../../../controllers/Error/attendanceManager');
const attendanceReportController = require('../../../../../controllers/get/attendanceReport');

const getContactListValidator = require('../../../../../validators/getContactList');
const getContactListErrorHandler = require('../../../../../controllers/Error/getContactList');
const getContactListController = require('../../../../../controllers/get/contactList');

const getHomeActivityController = require('../../../../../controllers/app/get/getHomeActivityReport');

router.post('/student-list', authorization(teacherAuthorizator), appValidator(getStudentListValidator, getStudentListErrorHandler), studentListController )
router.post('/attendance', authorization(teacherAuthorizator), appValidator(postAttendanceValidator, postAttendanceErrorHandler), postAttendanceController )
router.get(
    "/school/about/:id",
    authorization(teacherAuthorizator),
    everyoneAuthorization,
    getAboutSchoolController
  );
  router.get(
    "/school/events/:id/:date",
    authorization(teacherAuthorizator),
    everyoneAuthorization,
    getEventSchoolController
  );
  router.post(
    "/school/newses/:id",
    authorization(teacherAuthorizator),
    everyoneAuthorization,appValidator(managersValidator, managersErrorHandler),
    getNewsesSchoolController
  );
  router.get(
    "/school/news/:news_id",
    authorization(teacherAuthorizator),
    getNewsSchoolController
  );
  router.post('/school/magazines/:id', authorization(teacherAuthorizator),
    everyoneAuthorization,
    appValidator(managersValidator, managersErrorHandler),
    getMagazinesController);
    router.get(
      "/school/magazine/:id",
      authorization(teacherAuthorizator),
      getmagazineSchoolController
    );
    router.post('/school/reports/:id', authorization(teacherAuthorizator),
    everyoneAuthorization,
    appValidator(managersValidator, managersErrorHandler),
    getReportsController);
    router.get(
      "/school/report/:id",
      authorization(teacherAuthorizator),
      getReportSchoolController
    );
  router.post(
    "/gallery/:id",
    authorization(teacherAuthorizator),
    appValidator(managersValidator, managersErrorHandler),
    getGalleryController
  );
  router.post(
    "/gallery/:id/:courseID",
    authorization(teacherAuthorizator),
    appValidator(managersValidator, managersErrorHandler),
    getGalleryController
  );
  router.get(
    "/gallery-tag/:id",
    authorization(teacherAuthorizator),
    getGalleryTagsController
  );
router.post('/add-gallery',authorization(teacherAuthorizator),appValidator(appValidatorAddGallery,appValidatorErrorGallery),addGalleryController);

router.get('/encourages/:school_id', authorization(teacherAuthorizator), getTeacherEncourageList)
router.post('/encourage', authorization(teacherAuthorizator), appValidator(addEncourageTeacherValidator, addEncourageTeacherErrorHandler), addEncourageTeacherController)

router.post(
  "/upload/:dir",
  authorization(teacherAuthorizator),
  uploader,
  uploadResp
);
router.get(
  "/course-list",
  authorization(teacherAuthorizator),
  getCourseListController
);
router.post('/attendance/:course_id',authorization(teacherAuthorizator),appValidator(absenceCourseValidator, absenceCourseErrorHandleer),absenceCourseController)
router.get('/attendance-report/:course_id/:date',authorization(teacherAuthorizator), attendanceReportController);
router.post('/chat-contact-list/:id', authorization(teacherAuthorizator),everyoneAuthorization, appValidator(getContactListValidator, getContactListErrorHandler), getContactListController);
router.get('/home-activity/:courseid/:date',authorization(teacherAuthorizator),getHomeActivityController)
module.exports = router;
