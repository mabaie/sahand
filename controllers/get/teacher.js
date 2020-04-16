'use strict'
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const InternalError = require('../../Models/Error/Internal');
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectId;
module.exports = async (req, res, next)=>{
    try{
        let out = {};
        let haddress = 'نامشخص';
        const schoolID = req.data._id;
        let teacher = await UserModel.findOne({userName: req.params.id})
        teacher = teacher[0]
        let teacherProfile = await ProfileModel.findOne({_id: new ObjectID(teacher._id)});
        teacherProfile = teacherProfile[0];
        let teacherAddress = await TeacherModel.findOne({_id: new ObjectID(teacher._id)}).catch(err=>{haddress=undefined});
        if(!haddress){
            haddress = 'نامشخص';
        } else {
            if(teacherAddress && teacherAddress[0][schoolID]){
                haddress = teacherAddress[0][schoolID].haddress;
            }
        }
        out = {
            FirstName: teacher.fname,
            LastName: teacher.lname,
            ID: teacher.userName,
            FatherName: teacherProfile.faname,
            Email: teacherProfile.email,
            Mobile: teacherProfile.mobile,
            HomeAddress: haddress,
            EducationalDegree: teacherProfile.degree,
            Major: teacherProfile.major,
            BirthDay: teacherProfile.birthday
        };
        res.json(out)
    } catch(err){
        if(err instanceof InternalError){
            if(err.is(2)){
                return next(new ExternalError(21))
            }
        } else{
            console.log(err);
            return next(new Error())
        }
    } 
}