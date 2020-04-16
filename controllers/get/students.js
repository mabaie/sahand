'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const ParentModel = require('../../Models/parent').ParentModel;
const ChildrenModel = require('../../Models/children').ChildrenModel;
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

async function getStudentsController(req, res, next) {
    const body = req.body.valid.value;
    let filter = {
        school_id: new ObjectID(req.data._id),
        $or: [{'type.student': true}, {'type.parent': true}]
    };
    if(body.filter.hasOwnProperty('ID')){
        filter['userName'] = {
            $regex: `^${body.filter.ID}.*`
        }
        if (body.filter.ID === 'default') {
            filter.userName = {
                $regex: '^.*$'
            }
        }
    }else if(body.filter.hasOwnProperty('lastname') && body.filter.lastname!=='default'){
        filter['lname'] = {
            $regex: `^${body.filter.lastname}.*`
        }
    }else if(body.filter.hasOwnProperty('grade')){
        filter['grade']=body.filter.grade;
    }
    let sort = {_id:-1};
    if(body.hasOwnProperty('sort') && body.sort=='firstname-up'){
        sort = {fname:1}
    }if(body.hasOwnProperty('sort') && body.sort=='firstname-down'){
        sort = {fname:-1}
    } else if(body.hasOwnProperty('sort') && body.sort=='lastname-up'){
        sort = {lname:1}
    }else if(body.hasOwnProperty('sort') && body.sort=='lastname-down'){
        sort = {lname:-1}
    } else if(body.hasOwnProperty('sort') && body.sort=='modify'){
        sort = {modified_at:-1};
    }
    try {
        if(filter.hasOwnProperty('grade')){
            let students = await ProfileModel.find({grade:filter.grade},0,10000);
            await Promise.all(students.map(async (student)=>{
                try {
                    const data = await UserModel.findOne({
                        _id: student._id,
                    })
                    _.merge(student, data[0]);
                    //delete student.modified_at;
                    delete student.last_login;
                    delete student.type;
                    delete student.faname;
                    delete student.firstLogin;
                    delete student.canLogin;
                    delete student.isActive;
                    delete student.pass;
                    
                    const child = await ChildrenModel.findOne({
                        _id: student._id
                    });
                    const p1_id = child[0].parentOne;
                    const p2_id = child[0].parentTwo;
                    const parentOne = await UserModel.findOne({
                        _id: new ObjectID(p1_id)
                    });
                    const parentTwo = p2_id && await UserModel.findOne({
                        _id: new ObjectID(p2_id)
                    });
                    const parentOneProfile = await ProfileModel.findOne({
                        _id: new ObjectID(p1_id)
                    })
                    const parentTwoProfile = p2_id && await ProfileModel.findOne({
                        _id: new ObjectID(p2_id)
                    })
                    const parentOneAddress = await ParentModel.findOne({
                        _id: new ObjectID(p1_id)
                    });
                    const parentTwoAddress = p2_id && await ParentModel.findOne({
                        _id: new ObjectID(p2_id)
                    })
                    const parents = {
                        p1fname: parentOne[0].fname,
                        p1lname: parentOne[0].lname,
                        p1ID: parentOne[0].userName,
                        p1faname: parentOneProfile[0].faname,
                        p1birthday: parentOneProfile[0].birthday,
                        p1mobile: parentOneProfile[0].mobile,
                        p1degree: parentOneProfile[0].degree,
                        p1major: parentOneProfile[0].major,
                        p1job: parentOneProfile[0].job,
                        p1email: parentOneProfile[0].email,
                        p1_id: parentOne[0]._id,
                        p1haddress: parentOneAddress[0][req.data._id]['haddress'],
                        p1waddress: parentOneAddress[0][req.data._id]['waddress']
                    };
                    if (parentTwo) {
                        parents['p2fname'] = parentTwo[0].fname;
                        parents['p2lname'] = parentTwo[0].lname;
                        parents['p2ID'] = parentTwo[0].userName;
                        parents['p2faname'] = parentTwoProfile[0].faname;
                        parents['p2birthday'] = parentTwoProfile[0].birthday;
                        parents['p2mobile'] = parentTwoProfile[0].mobile;
                        parents['p2degree'] = parentTwoProfile[0].degree;
                        parents['p2major'] = parentTwoProfile[0].major;
                        parents['p2job'] = parentTwoProfile[0].job;
                        parents['p2email'] = parentTwoProfile[0].email;
                        parents['p2_id'] = parentTwo[0]._id;
                        parents['p2haddress'] = parentTwoAddress[0][req.data._id]['haddress'];
                        parents['p2waddress'] = parentTwoAddress[0][req.data._id]['waddress'];
                    }
                    _.merge(student, parents);
                }catch(err){
                }
            }));
            students = students.filter(s => {
                    return s.hasOwnProperty("school_id") && s.school_id.toString() === filter.school_id.toString()
                }
            )
            students.splice(0, body.skip);
            students.splice(body.limit, students.length-body.limit);
            res.json(students);
        }else{
            const students = await UserModel.find(filter, body.skip, body.limit ,null ,sort);
            //const students = await UserModel.find(filter, body.skip, body.limit);
            for (let student of students) {
                delete student.pass;
                const profile = await ProfileModel.findOne({
                    _id: student._id
                });
                _.merge(student, profile[0]);
                //delete student.modified_at;
                delete student.last_login;
                delete student.type;
                delete student.faname;
                delete student.firstLogin;
                delete student.canLogin;
                delete student.isActive;
                
                const child = await ChildrenModel.findOne({
                    _id: student._id
                });
                const p1_id = child[0].parentOne;
                const p2_id = child[0].parentTwo;
                const parentOne = await UserModel.findOne({
                    _id: new ObjectID(p1_id)
                });
                const parentTwo = p2_id && await UserModel.findOne({
                    _id: new ObjectID(p2_id)
                });
                const parentOneProfile = await ProfileModel.findOne({
                    _id: new ObjectID(p1_id)
                })
                const parentTwoProfile = p2_id && await ProfileModel.findOne({
                    _id: new ObjectID(p2_id)
                })
                const parentOneAddress = await ParentModel.findOne({
                    _id: new ObjectID(p1_id)
                });
                const parentTwoAddress = p2_id && await ParentModel.findOne({
                    _id: new ObjectID(p2_id)
                })
                const parents = {
                    p1fname: parentOne[0].fname,
                    p1lname: parentOne[0].lname,
                    p1ID: parentOne[0].userName,
                    p1faname: parentOneProfile[0].faname,
                    p1birthday: parentOneProfile[0].birthday,
                    p1mobile: parentOneProfile[0].mobile,
                    p1degree: parentOneProfile[0].degree,
                    p1major: parentOneProfile[0].major,
                    p1job: parentOneProfile[0].job,
                    p1email: parentOneProfile[0].email,
                    p1_id: parentOne[0]._id,
                    p1haddress: parentOneAddress[0][req.data._id]['haddress'],
                    p1waddress: parentOneAddress[0][req.data._id]['waddress']
                };
                if(parentOneProfile[0].hasOwnProperty('homePhone')){
                    parents['p1homePhone']=parentOneProfile[0].homePhone;
                }
                if (parentTwo) {
                    parents['p2fname'] = parentTwo[0].fname;
                    parents['p2lname'] = parentTwo[0].lname;
                    parents['p2ID'] = parentTwo[0].userName;
                    parents['p2faname'] = parentTwoProfile[0].faname;
                    parents['p2birthday'] = parentTwoProfile[0].birthday;
                    parents['p2mobile'] = parentTwoProfile[0].mobile;
                    parents['p2degree'] = parentTwoProfile[0].degree;
                    parents['p2major'] = parentTwoProfile[0].major;
                    parents['p2job'] = parentTwoProfile[0].job;
                    parents['p2email'] = parentTwoProfile[0].email;
                    parents['p2_id'] = parentTwo[0]._id;
                    parents['p2haddress'] = parentTwoAddress[0][req.data._id]['haddress'];
                    parents['p2waddress'] = parentTwoAddress[0][req.data._id]['waddress'];
                    if(parentTwoProfile[0].hasOwnProperty('homePhone')){
                        parents['p2homePhone']=parentTwoProfile[0].homePhone;
                    }
                }
                _.merge(student, parents);
            }
            res.json(students);
        }
    } catch (err) {
        
        next(new ExternalError(25));
    }

}

module.exports = getStudentsController;