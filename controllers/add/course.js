const Course = require('../../Models/course').Course;
const CourseModel = require('../../Models/course').CourseModel;
const ExternalError = require('../../Models/Error/External');
const TeacherModel = require('../../Models/teacher').TeacherModel;
const ObjectID = require('mongodb').ObjectID;
async function register(course, school_id, next) {
    const courseRelations = course;//._id;
    try {
        await CourseModel.findOne({
            coname: courseRelations.coname,
            teacher_id: new ObjectID(courseRelations.teacher_id),
            class_id: new ObjectID(courseRelations.class_id)
        }).then(() => {
            return next(new ExternalError(13));
        }).catch(err => {
            let id;
            if (err.is(2)) {
                const newCourse = new Course({
                    _id: id = new ObjectID(),
                    coname: courseRelations.coname,
                    class_id: new ObjectID(courseRelations.class_id),
                    teacher_id: new ObjectID(courseRelations.teacher_id),
                    periods: courseRelations.periods,
                    modified_at: new Date()
                })
                newCourse.save().then(async() => {
                    await TeacherModel.findOneAndUpdate({ _id: new ObjectID(courseRelations.teacher_id) }, { $addToSet: { [`${school_id}.courses`]: id } }, { upsert: true })
                    return next(new ExternalError(15))
                }).catch(err => {
                    throw err;
                })
                
            }
            else {
                throw err;
            }
        })
    } catch (err) {

        throw err;
    }
}

async function CourseController(req, res, next) {
    const body = req.body;
    //await Promise.all(body.map(course=>{
    //    if(course._id.class_id){
    try {
        return await register(body, req.data._id,next);
    } catch (err) {
        throw err;
    }
    //    }
    //   else{
    //       
    //  }
    //})).catch(err=>{
    //    throw err;
    //})
}

module.exports = CourseController;