"use strict";
const authorization = require("../../../../middlewares/authorization");
const managerAuthorization = require("../../../../services/authorizators/manager");
const aboutSchoolUpdateController = require("../../../../controllers/update/aboutSchool");
const appValidator = require("../../../../middlewares/appValidator");
const aboutSchoolValidator = require("../../../../validators/aboutSchool");
const aboutSchoolErrorHandler = require("../../../../controllers/Error/aboutSchool");
const aboutSchoolGetController = require("../../../../controllers/get/aboutSchool");
const schoolAvatarUploader = require("../../../../middlewares/schoolAvatarUploader");
const updateAvatarController = require("../../../../controllers/update/schoolAvatar");
const addSchoolNews = require("../../../../controllers/add/schoolNews");
const updateSchoolNews = require("../../../../controllers/update/schoolNews");
const addSchoolNewsValidator = require("../../../../validators/addSchoolNews");
const addSchoolNewsErrorHandler = require("../../../../controllers/Error/addSchoolNews");
const addEncourageValidator = require("../../../../validators/addEncourage");
const addEncourageErrorHandler = require("../../../../controllers/Error/addEncourage");
const addEncourageController = require("../../../../controllers/add/encourage");
const getEncouragesController = require("../../../../controllers/get/encouragesList");
const deleteEncourageController = require('../../../../controllers/delete/schoolEncourage');
const addSchoolMagazine = require("../../../../controllers/add/schoolMagazin");
const addSchoolMagazineErrorHandler = require("../../../../controllers/Error/addSchoolMagazine")
const addSchoolMagazineValidator = require("../../../../validators/addSchoolMagazine");
const updateSchoolMagazine = require("../../../../controllers/update/schoolMagazine")
const uploader = require("../../../../middlewares/uploader");
const uploadResp = require("../../../../controllers/add/uploadFile");
const addHomeActivityValidator = require("../../../../validators/addHomeActivity");
const addHomeActivityErrorHandler = require("../../../../controllers/Error/addHomeActivity");
const addHomeActivityController = require("../../../../controllers/add/homeActivity");
const getHomeActivityListController = require("../../../../controllers/get/homeActivityList");
const deleteHomeActivityController = require("../../../../controllers/delete/schoolHomeActivity");

const addSchoolReport = require("../../../../controllers/add/schoolReport");
const updateSchoolReport = require("../../../../controllers/update/schoolReport");
const addAbsenceForAllController = require("../../../../controllers/add/absenceForAll");
const addAbsenceForAllValidator = require("../../../../validators/addAbscenceForAll");
const addAbsenceForAllErrorHandler = require("../../../../controllers/Error/addAbscenceForAll");
const dateValidator = require('../../../../middlewares/dateValidator');

const resetPasswordController = require('../../../../controllers/add/resetUserPasword');

const getSchoolDayAbscenceReport = require('../../../../controllers/get/schoolDayAbscenceReport');
const getSchoolMonthAbscenceReport = require('../../../../controllers/get/schoolMonthAbscenceReport');

const router = require("express").Router();

router.put(
  "/school/about",
  authorization(managerAuthorization),
  appValidator(aboutSchoolValidator, aboutSchoolErrorHandler),
  aboutSchoolUpdateController
);
router.put(
  "/school/avatar",
  authorization(managerAuthorization),
  schoolAvatarUploader,
  updateAvatarController
);
router.get(
  "/school/about",
  authorization(managerAuthorization),
  aboutSchoolGetController
);
router.post(
  "/school/news",
  authorization(managerAuthorization),
  appValidator(addSchoolNewsValidator, addSchoolNewsErrorHandler),
  addSchoolNews
);
router.put(
  "/school/news/:id",
  authorization(managerAuthorization),
  appValidator(addSchoolNewsValidator, addSchoolNewsErrorHandler),
  updateSchoolNews
);

router.post(
  "/school/magazine",
  authorization(managerAuthorization),
  appValidator(addSchoolMagazineValidator, addSchoolMagazineErrorHandler),
  addSchoolMagazine
);

router.put(
  "/school/magazine/:id",
  authorization(managerAuthorization),
  appValidator(addSchoolMagazineValidator, addSchoolMagazineErrorHandler),
  updateSchoolMagazine
);

router.post(
  "/school/report",
  authorization(managerAuthorization),
  appValidator(addSchoolMagazineValidator, addSchoolMagazineErrorHandler),
  addSchoolReport
);

router.put(
  "/school/report/:id",
  authorization(managerAuthorization),
  appValidator(addSchoolMagazineValidator, addSchoolMagazineErrorHandler),
  updateSchoolReport
);

router.post(
  "/school/upload/:dir",
  authorization(managerAuthorization),
  uploader,
  uploadResp
);

router.post(
  "/school/encourage",
  authorization(managerAuthorization),
  appValidator(addEncourageValidator, addEncourageErrorHandler),
  addEncourageController
);
router.get(
  "/school/encourages",
  authorization(managerAuthorization),
  getEncouragesController
);
router.delete(
  "/school/encourage/:id",
  authorization(managerAuthorization),
  deleteEncourageController
);
router.post(
  "/school/home-activity",
  authorization(managerAuthorization),
  appValidator(addHomeActivityValidator, addHomeActivityErrorHandler),
  addHomeActivityController
);
router.get(
  "/school/home-activity-list",
  authorization(managerAuthorization),
  getHomeActivityListController
);
router.delete(
  "/school/home-activity/:id",
  authorization(managerAuthorization),
  deleteHomeActivityController
);

router.post("/school/absence",
  authorization(managerAuthorization),
  appValidator(addAbsenceForAllValidator, addAbsenceForAllErrorHandler),
  addAbsenceForAllController
);

router.post("/school/reset_password_user",
  authorization(managerAuthorization),
  resetPasswordController
);

router.get('/school/absence-day/:date', authorization(managerAuthorization), dateValidator, getSchoolDayAbscenceReport);
router.get('/school/absence-month/:date', authorization(managerAuthorization), dateValidator, getSchoolMonthAbscenceReport);

// router.post(
//   "/school/absence",
//   authorization(managerAuthorization),
//   absenceController
// );
module.exports = router;