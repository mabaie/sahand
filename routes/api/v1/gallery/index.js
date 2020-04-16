'use strict'
const authorization = require('../../../../middlewares/authorization');
const managerAuthorization = require('../../../../services/authorizators/manager');
const appValidator = require('../../../../middlewares/appValidator');
const managersValidator = require('../../../../validators/managers');
const managersErrorHandler = require('../../../../controllers/Error/managers');
const getGalleryManagerController = require('../../../../controllers/get/gallery/galleryManager');
const getGalleryTeacherController = require('../../../../controllers/get/gallery/galleryTeacher');
const getGalleryManagerTagsController = require('../../../../controllers/get/gallery/galleryManagerTags');
const getGalleryTeacherTagsController = require('../../../../controllers/get/gallery/galleryTeacherTags');
const getGalleryTeacherCourseController = require('../../../../controllers/get/gallery/galleryTeacherCourse');
const getGalleryTeacherListController = require('../../../../controllers/get/gallery/galleryTeacherList');
const deleteManagerValidator = require('../../../../validators/deleteManager');
const deleteManagerErrorHandleer = require('../../../../controllers/Error/deleteManager');
const deleteGalleryController = require('../../../../controllers/delete/gallery');

const addGalleryController = require('../../../../controllers/add/schoolGalleryImage');
const appValidatorAddGallery = require('../../../../validators/addGalleryManager');
const appValidatorErrorGallery = require('../../../../controllers/Error/addGalleryManager');

const updateImageController = require('../../../../controllers/update/galleryImage');
const updateValidate = require('../../../../validators/updateGalleryImage');
const updateValidateError = require('../../../../controllers/Error/updateGalleryImage');

const router = require('express').Router();

router.post('/gallerymanager', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getGalleryManagerController);
router.post('/galleryteacher', authorization(managerAuthorization), appValidator(managersValidator, managersErrorHandler), getGalleryTeacherController);
router.get('/gallerymanagertags', authorization(managerAuthorization), getGalleryManagerTagsController);
router.get('/galleryteachertags', authorization(managerAuthorization), getGalleryTeacherTagsController);
router.get('/galleryteacher-course', authorization(managerAuthorization), getGalleryTeacherCourseController);
router.get('/galleryteacher-list', authorization(managerAuthorization), getGalleryTeacherListController);

router.delete('/delgallery', authorization(managerAuthorization), appValidator(deleteManagerValidator, deleteManagerErrorHandleer), deleteGalleryController);

router.post('/addgallery',authorization(managerAuthorization),appValidator(appValidatorAddGallery,appValidatorErrorGallery),addGalleryController);

router.put('/updategallery/:id',authorization(managerAuthorization),appValidator(updateValidate,updateValidateError),updateImageController);
module.exports = router;
