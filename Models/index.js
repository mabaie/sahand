'use strict';

const {
    createProfileModel,
    ProfileModel
} = require('./profile');
const {
    createUserModel,
    UserModel
} = require('./user');
const {
    createSchoolModel,
    SchoolModel
} = require('./school');

const {
    createParentModel,
    ParentModel
} = require('./parent');

const {
    createChildrenModel,
    ChildrenModel
} = require('./children');

const {
    createTeacherModel,
    TeacherModel
} = require('./teacher');

const {
    createClassModel,
    ClassModel
} = require('./class');

const {
    createCourseModel,
    CourseModel
} = require('./course');

const {
    createNewsModel,
    NewsModel
} = require('./news');

const {
    createReportModel,
    ReportModel
} = require('./report');

const {
    createMagazineModel,
    MagazineModel
} = require('./magazine');

const {
    createHomeActivityModel,
    HomeActivityModel
} = require('./homeActivity');

const {
    createCalendarEventModel,
    CalendarEventModel
} = require('./event');
const {
    createEncourageModel,
    EncourageModel
} = require('./encourage');

const {
    createSettingAppointmentModel,
    SettingAppointmentModel
} = require('./settingAppointment');

const {
    createAssignmentModel,
    AssignmentModel
} = require('./assignment');

const {
    createGalleryModel,
    GalleryModel
} = require('./gallery');

const {
    createChatModel,
    ChatModel
} = require('./chat');

const {
    createTermModel,
    TermModel
} = require('./term');

const ChangeTracker = require('../services/changeTracker');
const MessageChangeTracker=require('../services/changeTracker/messageChangeTracker');
const CourseChangeTracker=require('../services/changeTracker/CourseChangeTracker');
const AssignmentChangeTracker = require('../services/changeTracker/AssignmentChangeTracker');

module.exports = async function (config, client) {
    let openConnections = [];

    createUserModel('user', config.connections[0],
        require('./user/Schema'), require('./user/Validator'));
    await UserModel.createCollection();
    //openConnections.push(await UserModel.createChangeTracker());
    //UserModel.changeTracker.addTracker('all');

    createProfileModel('profile', config.connections[0],
        require('./profile/Schema'), require('./profile/Validator'));
    await ProfileModel.createCollection();
    //openConnections.push(await ProfileModel.createChangeTracker());
    //ProfileModel.changeTracker.addTracker('all');

    createSchoolModel('school', config.connections[0],
        require('./school/Schema'), require('./school/Validator'));
    await SchoolModel.createCollection();
    //openConnections.push(await SchoolModel.createChangeTracker());
    //SchoolModel.changeTracker.addTracker('all');

    createParentModel('parent', config.connections[0],
        require('./parent/Schema'), require('./parent/Validator'));
    await ParentModel.createCollection();
    //openConnections.push(await ParentModel.createChangeTracker());
    //ParentModel.changeTracker.addTracker('all');

    createChildrenModel('children', config.connections[0],
        require('./children/Schema'), require('./children/Validator'));
    await ChildrenModel.createCollection();
    //openConnections.push(await ChildrenModel.createChangeTracker());
    //ChildrenModel.changeTracker.addTracker('all');

    createTeacherModel('teacher', config.connections[0],
        require('./teacher/Schema'), require('./teacher/Validator'));
    await TeacherModel.createCollection();
    //openConnections.push(await TeacherModel.createChangeTracker());
    //TeacherModel.changeTracker.addTracker('all');

    createClassModel('class', config.connections[0],
        require('./class/Schema'), require('./class/Validator'));
    await ClassModel.createCollection();
    //openConnections.push(await ClassModel.createChangeTracker());
    //ClassModel.changeTracker.addTracker('all');

    createCourseModel('course', config.connections[0],
        require('./course/Schema'), require('./course/Validator'));
    await CourseModel.createCollection();
    openConnections.push(await CourseModel.createChangeTracker(CourseChangeTracker, client));
    CourseModel.changeTracker.addTracker('abscence');
    
    createNewsModel('news', config.connections[0],
        require('./news/Schema'), require('./news/Validator'));
    await NewsModel.createCollection();
    openConnections.push(await NewsModel.createChangeTracker(ChangeTracker, client));
    NewsModel.changeTracker.addTracker('all');

    createMagazineModel('magazine', config.connections[0],
        require('./magazine/Schema'), require('./magazine/Validator'));
    await MagazineModel.createCollection();
    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');
    createReportModel('report', config.connections[0],
        require('./report/Schema'), require('./report/Validator'));
    await ReportModel.createCollection();
    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');
    createHomeActivityModel('homeActivity', config.connections[0],
        require('./homeActivity/Schema'), require('./homeActivity/Validator'));
    await HomeActivityModel.createCollection();
    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');
    createEncourageModel('encourage', config.connections[0],
        require('./encourage/Schema'), require('./encourage/Validator'));
    await EncourageModel.createCollection();
    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');
    createSettingAppointmentModel('settingAppointment', config.connections[0],
        require('./settingAppointment/Schema'), require('./settingAppointment/Validator'));
    await SettingAppointmentModel.createCollection();
    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');
    createCalendarEventModel('calendarEvent', config.connections[0],
        require('./event/Schema'), require('./event/Validator'));
    await CalendarEventModel.createCollection();

    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');
    createAssignmentModel('assignment', config.connections[0],
        require('./assignment/Schema'), require('./assignment/Validator'));
    await AssignmentModel.createCollection();

    openConnections.push(await AssignmentModel.createChangeTracker(AssignmentChangeTracker, client));
    AssignmentModel.changeTracker.addTracker('all');

    createGalleryModel('gallery', config.connections[0],
        require('./gallery/Schema'), require('./gallery/Validator'));
    await GalleryModel.createCollection();

    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');

    createChatModel('chat', config.connections[0],
        require('./chat/Schema'), require('./chat/Validator'));
    await ChatModel.createCollection();

    openConnections.push(await ChatModel.createChangeTracker(MessageChangeTracker, client));
    ChatModel.changeTracker.addTracker('all');

    createTermModel('term', config.connections[0],
        require('./term/Schema'), require('./term/Validator'));
    await TermModel.createCollection();

    //openConnections.push(await CourseModel.createChangeTracker());
    //CourseModel.changeTracker.addTracker('all');
    return openConnections;
};