'use strict'
const ObjectID=require('mongodb').ObjectId;
const buildQuery = require('../../services/buildQuery');
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const ExternalError = require('../../Models/Error/External');

module.exports = async (id, req, res, next)=>{
    if(id instanceof ExternalError){
        console.log('here')
        next(id)
    }else{
        const body = req.body.valid.value;
        const teacherUpdateRecord = buildQuery(body);
        const userID = new ObjectID(id);
        const schoolID = new ObjectID(req.data._id);
        try{
            await Promise.all([UserModel.findOneAndUpdate({_id: userID}, 
                {
                    $set: {
                        fname: teacherUpdateRecord.fname,
                        lname: teacherUpdateRecord.lname,
                        'type.teacher': true
                    },
                    $currentDate: {last_modified: true}
                }, {upsert:false})
                , ProfileModel.findOneAndUpdate({_id: userID}, 
                    {
                        $set: {
                            faname: teacherUpdateRecord.faname,
                            degree: teacherUpdateRecord.degree,
                            major: teacherUpdateRecord.major,
                            birthday: new Date(teacherUpdateRecord.birthday),
                            mobile: teacherUpdateRecord.mobile,
                            email: teacherUpdateRecord.email
                        },
                        $currentDate: {modified_at: true}
                    }, 
                    {upsert: false})
                , TeacherModel.findOneAndUpdate({_id: userID},
                    {
                        $set: {[schoolID + '.haddress']: teacherUpdateRecord.haddress},
                        $currentDate: {modified_at: true}
                    },
                    {upsert:true})
                ]);
            res.json({success: 1});
        } catch (err){
            console.log(err)
        }
    } 
}