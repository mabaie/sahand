const CourseModel = require('../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;
async function addStudentToCourse(req, res, next){
    const body = req.body;
    await CourseModel.findOneAndUpdate({_id: new ObjectID(req.params.id)}, {$addToSet: {students: {$each: body}}},{upsert:true})    
    res.json({err: 'ok'});
}
module.exports = addStudentToCourse;