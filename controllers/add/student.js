"use strict";
const UserModel = require("../../Models/user/").UserModel;
const ProfileModel = require("../../Models/profile/").ProfileModel;
const ParentModel = require("../../Models/parent/").ParentModel;
const ExternalError = require("../../Models/Error/External");
const Promise = global.Promise;
const ObjectID = require("mongodb").ObjectID;
const generatePass = require('../../services/generatePass');
const bcrypt = require('bcrypt');
const User = require('../../Models/user').User;
const Profile = require('../../Models/profile').Profile;
const Parent = require('../../Models/parent').Parent;
const sendConfirmation = require('../../services/sendConfirmation');
const sendSMSConfirmation = require('../../services/sendSMSConfirmation');
const ChildrenModel = require('../../Models/children').ChildrenModel;
const jMoment = require('moment-jalaali');

async function checkExist(body, ids) {
    const enteredID = [];
    if (body["P1ID"]) {
        enteredID.push({
            ID: body["P1ID"],
            name: "p1"
        });
    }
    if (body["P2ID"]) {
        enteredID.push({
            ID: body["P2ID"],
            name: "p2"
        });
    }
    if (body["ID"]) {
        enteredID.push({
            ID: body["ID"],
            name: "s1"
        });
    }
    const notExisted = [];
    const res = await Promise.all(
        enteredID.map(rec =>
            UserModel.findOne({
                userName: rec.ID
            })
            .then(res => {
                if (res[0]) {
                    if (rec.name === 'p1' || rec.name === 'p2') {
                        ids.push({
                            type: rec.name,
                            id: res[0]._id
                        });
                    } else if (rec.name === 's1') {
                        ids.push({
                            type: 's',
                            id: res[0]._id
                        });
                    }
                }
                return res[0] ? {
                        res: res[0],
                        name: rec.name
                    } :
                    undefined;
            })
            .catch(err => {
                notExisted.push(rec.name);
                return undefined;
            })
        )
    );
    return {
        existed: res.filter(function (element) {
            return element !== undefined;
        }),
        notExisted: notExisted
    };
}

function buidldUserUpdateExpression(body, name, school_id) {
    const Query = {
        $set: {},
        $currentDate: {
            modified_at: true
        }
    };

    for (let field in body) {
        let key = field;
        if (name === "p1" || name === "p2") {
            const prefix = field.slice(0, 2);
            if (prefix !== name.toUpperCase()) {
                continue;
            }
            key = field.slice(2);
            Query.$set["type.parent"] = true;
        } else {
            Query.$set["type.student"] = true;
            Query.$set['school_id'] = school_id;
        }
        switch (key) {
            case "FirstName":
                Query.$set["fname"] = body[field];
                break;
            case "LastName":
                Query.$set["lname"] = body[field];
                break;
            default:
                break;
        }
    }
    return Query;
}

function buidldProfileUpdateExpression(body, name, school_id) {
    const Query = (name === "p1" || name === "p2")?
        {
        $set: {},
        $currentDate: {
            modified_at: true
        }
    }:
    {
        $set: {},
        $addToSet: {},
        $currentDate: {
            modified_at: true
        }
    };
    for (let field in body) {
        let key = field;
        if (name === "p1" || name === "p2") {
            const prefix = field.slice(0, 2);
            if (prefix !== name.toUpperCase()) {
                continue;
            }
            key = field.slice(2);
            //Query.$set["type.parent"] = true;
        } else {
            //Query.$set["type.student"] = true;
        }
        switch (key) {
            case "FatherName":
                Query.$set["faname"] = body[field];
                break;
            case "EducationalDegree":
                Query.$set["degree"] = body[field];
                break;
            case "Job":
                Query.$set["job"] = body[field];
                break;
            case "Major":
                Query.$set["major"] = body[field];
                break;
            case "BirthDay":
                Query.$set["birthday"] = new Date(body[field]);
                break;
            case "Mobile":
                Query.$set["mobile"] = body[field];
                break;
            case "Email":
                Query.$set["email"] = body[field];
                break;
            case "Grade":
                Query.$set["grade"] = body[field];
                break;
            case "Image":
                Query.$set["image"] = body[field];
                break;
            case "BirthPlace":
                Query.$set["birthPlace"] = body[field];
                break;
            case "HomePhone":
                Query.$set["homePhone"] = body[field];
                break;
            case "IssuePlace":
                Query.$set["issuePlace"] = body[field];
                break;
            case "Religion":
                Query.$set["religion"] = body[field];
                break;
            case "Mazhab":
                Query.$set["mazhab"] = body[field];
                break;
            case "Citizenship":
                Query.$set["citizenship"] = body[field];
                break;
            case "AcademicYear":
                console.log('body is',body)
                let year = jMoment(new Date(body[field]));
                if(year.jMonth() <= 4 && year.jMonth() >0){
                    year.subtract(1, 'jYear');
                }
                Query.$addToSet["academic_year"] ={ $each:[{school_id:school_id,year: new Date(year.startOf('jYear').toISOString()),grade:body["Grade"]}]};
                break;
        }
    }
    console.log('Query last',name,Query)
    return Query;
}

function buidldParentUpdateExpression(body, name, school_id) {
    const Query = {
        $set: {},
        $currentDate: {
            modified_at: true
        }
    };

    for (let field in body) {
        let key = field;
        if (name === "p1" || name === "p2") {
            const prefix = field.slice(0, 2);
            if (prefix !== name.toUpperCase()) {
                continue;
            }
            key = field.slice(2);
        } else {
            return undefined;
        }
        switch (key) {
            case "HomeAddress":
                Query.$set[`${school_id}.haddress`] = body[field];
                break;
            case "WorkAddress":
                Query.$set[`${school_id}.waddress`] = body[field];
        }
    }
    return Query;
}

async function createNotExistedParent(body, name, ids, school_id) {
    if (name !== 'p1' && name !== 'p2') {
        return undefined;
    }
    const pass = generatePass();
   await sendConfirmation(body[name.toUpperCase() + 'FirstName'], body[name.toUpperCase() +'LastName'], body[name.toUpperCase()+'ID'], pass, 'app.sahand@gmail.com');
//   await sendConfirmation(body[name.toUpperCase() + 'FirstName'], body[name.toUpperCase() +'LastName'], body[name.toUpperCase()+'ID'], pass, body[name.toUpperCase() +'Email']);
 //   sendSMSConfirmation(body[name.toUpperCase() +'FirstName'], body[name.toUpperCase() +'LastName'], body[name.toUpperCase()+'ID'], pass, body[name.toUpperCase() +'Mobile']);
    const hashedPass = await bcrypt.hash(pass, 10);
    try {
        const createUserRecord = {
            fname: body[name.toUpperCase() + 'FirstName'],
            lname: body[name.toUpperCase() + 'LastName'],
            modified_at: new Date(),
            last_login: new Date(),
            pass: hashedPass,
            firstLogin: true,
            userName: body[name.toUpperCase() + 'ID'],
            canLogin: true,
            isActive: false,
            type: {
                ['parent']: true
            }
        }
        const user = new User(createUserRecord);
        await user.save().catch((err) => {
            //console.log(err);
        });
        let createProfileRecord = {
            _id: user.getId(),
            faname: body[name.toUpperCase() + 'FatherName'],
            birthday: new Date(body[name.toUpperCase() + 'BirthDay']),
            mobile: body[name.toUpperCase() + 'Mobile'],
            degree: body[name.toUpperCase() + 'EducationalDegree'],
            job: body[name.toUpperCase() + 'Job'],
            major: body[name.toUpperCase() + 'Major'],
            email: body[name.toUpperCase() + 'Email'],
            modified_at: new Date(),
        }
        if(body.hasOwnProperty(name.toUpperCase() + 'HomePhone')){
            createProfileRecord['homePhone'] = body[name.toUpperCase() + 'HomePhone'];
        }
        const profile = new Profile(createProfileRecord);
        await profile.save().catch(err => {
            //console.log(err);
        });
        let parentRecord = {
            modified_at: new Date(),
            [school_id]: {
                haddress: body[name.toUpperCase() + 'HomeAddress'],
                waddress: body[name.toUpperCase() + 'WorkAddress'],
            },
            _id: user.getId(),
        }
        const newParent = new Parent(parentRecord);
        await newParent.save();
        ids.push({
            type: name,
            id: user.getId()
        });
    } catch (err) {
        //console.log(err);
        throw err;
    }
}
async function createChildrenRelations(ids){
    
    let student_id;
    let parentOne_id;
    let parentTwo_id;
    for(let id of ids){
        if(id.type === 's'){
            student_id = id.id;
        } else if(id.type === 'p1'){
            parentOne_id = id.id;
        } else if(id.type === 'p2'){
            parentTwo_id = id.id;
        }
    }
    let updateRecord = {$set: {parentOne: parentOne_id}};

    if(parentTwo_id) {
        updateRecord.$set['parentTwo'] = parentTwo_id;
    }

    await ChildrenModel.findOneAndUpdate({_id: new require('mongodb').ObjectID(student_id)}, updateRecord, {upsert : true});
}

async function createNotExistedStudent(body, name, ids, school_id) {
    if (name !== 's1') {
        return undefined;
    }

    const pass = generatePass();
  //  await sendConfirmation(body['FirstName'], body['LastName'], body['ID'], pass, body['Email']);
  //  sendSMSConfirmation(body['FirstName'], body['LastName'], body.ID, pass, body['Mobile']);
    const hashedPass = await bcrypt.hash(pass, 10);
    try {
        const createUserRecord = {
            fname: body['FirstName'],
            lname: body['LastName'],
            modified_at: new Date(),
            last_login: new Date(),
            pass: hashedPass,
            firstLogin: true,
            userName: body['ID'],
            canLogin: false,
            isActive: false,
            school_id: school_id,
            type: {
                ['student']: true
            }
        }
        const user = new User(createUserRecord);
        await user.save().catch((err) => {
            
        });
        let createProfileRecord = {
            _id: user.getId(),
            faname: body['FatherName'],
            birthday: new Date(body['BirthDay']),
            mobile: body['Mobile'],
            email: body['Email'],
            grade: body['Grade'],
            modified_at: new Date(),
        }
        if(body.hasOwnProperty('Image')){
            createProfileRecord['image'] = body['Image'];
        }
        if(body.hasOwnProperty('BirthPlace')){
            createProfileRecord['birthPlace'] = body['BirthPlace'];
        }
        if(body.hasOwnProperty('IssuePlace')){
            createProfileRecord['issuePlace'] = body['IssuePlace'];
        }
        if(body.hasOwnProperty('Religion')){
            createProfileRecord['religion'] = body['Religion'];
        }
        if(body.hasOwnProperty('Mazhab')){
            createProfileRecord['mazhab'] = body['Mazhab'];
        }
        if(body.hasOwnProperty('Citizenship')){
            createProfileRecord['citizenship'] = body['Citizenship'];
        }
        if (body.hasOwnProperty("AcademicYear")){
            let year = jMoment(new Date(body["AcademicYear"]));
            if(year.jMonth() <= 4 && year.jMonth() >0){
                year.subtract(1, 'jYear');
            }
            createProfileRecord["academic_year"] = [{school_id:school_id,year: new Date(year.startOf('jYear').toISOString()),grade:body["Grade"]}];
        }
        const profile = new Profile(createProfileRecord);
        await profile.save().catch(err => {
            
        });
        ids.push({
            type: 's',
            id: user.getId()
        });
    } catch (err) {
        throw err;
    }
}

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    let ids = [];
    const seperatedUsers = await checkExist(body, ids);
    await Promise.all(
        seperatedUsers.existed.map(e => {
            return UserModel.findOneAndUpdate({
                    _id: new ObjectID(e.res._id)
                },
                buidldUserUpdateExpression(body, e.name, req.data._id), {
                    upsert: false
                }
            ).catch(err => {
                if (err.is(2)) {
                    next(new ExternalError(72));
                }
                return undefined;
            });
        })
    ).catch(err => {
        throw err;
    });
    await Promise.all(seperatedUsers.existed.map(e => ProfileModel.findOneAndUpdate({
        _id: e.res._id
    }, buidldProfileUpdateExpression(body, e.name, req.data._id), {
        upsert: false
    }).catch(err => {
        if (err.is(2)) {
            next(new ExternalError(72))
        }
        return undefined;
    }))).catch(err => {
        throw err;
    });
    await Promise.all(seperatedUsers.existed.map(e => (e.name === 'p1' || e.name === 'p2') && ParentModel.findOneAndUpdate({
        _id: e.res._id
    }, buidldParentUpdateExpression(body, e.name, req.data._id), {
        upsert: true
    }).catch(err => {
        
        if (err.is(2)) {
            next(new ExternalError(72))
        }
        return undefined;
    }))).catch(err => {
        throw err;
    });    
    await Promise.all(seperatedUsers.notExisted.map(e => createNotExistedParent(body, e, ids, req.data._id).catch(err => undefined)));
    await Promise.all(seperatedUsers.notExisted.map(e => createNotExistedStudent(body, e, ids, req.data._id).catch(err => undefined)));
    await createChildrenRelations(ids);
    res.json("success");
};
