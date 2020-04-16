const CourseModel = require('../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;
async function addStudentToCourse(req, res, next){
    const body = req.body;
    const class_id = req.params.id;
    course_list = await CourseModel.find({class_id: new ObjectID(class_id)},0,1000,{_id:1});
    console.log("course_list:",course_list)
    await Promise.all(course_list.map(course=>{
        CourseModel.findOneAndUpdate({_id: new ObjectID(course._id)}, {$addToSet: {students: {$each: body}}},{upsert:true})    
    }))
    res.json({err: 'ok'});
}
module.exports = addStudentToCourse;