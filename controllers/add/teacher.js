const User = require('../../Models/user').User;
const UserModel = require('../../Models/user').UserModel;
const Profile = require('../../Models/profile').Profile;
const Teacher = require('../../Models/teacher').Teacher;
const ExternalError = require('../../Models/Error/External');
const bcrypt = require('bcrypt');
const generatePass = require('../../services/generatePass');
const sendConfirmation = require('../../services/sendConfirmation');
const sendSMSConfirmation = require('../../services/sendSMSConfirmation');

async function TeacherController(req, res, next) {
    const body = req.body.valid.value;
    
    UserModel.findOne({
        userName: body.ID,
    }).then((res) => {
        next(res[0]._id)
    }).catch(async (err) => {
        if (err.is(2)) {
            try {
                if (!(body.Password)) {
                    body.Password = generatePass();
                }
                await sendConfirmation(body.FirstName, body.LastName, body.ID, body.Password, body.Email);
                //sendSMSConfirmation(body.FirstName, body.LastName, body.ID, body.Password, body.Mobile);
                const hashedPass = await bcrypt.hash(body.Password, 10);
                const newUser = new User({
                    userName: body.ID,
                    pass: hashedPass,
                    fname: body.FirstName,
                    lname: body.LastName,
                    canLogin: true,
                    isActive: false,
                    modified_at: new Date(),
                    last_login: new Date(),
                    firstLogin: true,
                    type: {
                        ['teacher']: true
                    }
                });
                await newUser.save();
                let profileRecord = {
                    _id: newUser.getId(),
                    faname: body.FatherName,
                    degree: body.EducationalDegree,
                    major: body.Major,
                    birthday: new Date(body.BirthDay),
                    mobile: body.Mobile,
                    email: body.Email,
                    modified_at: new Date(),
                }
                const newProfile = new Profile(profileRecord);
                await newProfile.save();
                let teacherRecord = {
                    modified_at: new Date(),
                    [req.data._id]: {
                        haddress: body.HomeAddress,
                        courses: [],
                    },
                    _id: newUser.getId(),
                }
                const newTeacher = new Teacher(teacherRecord);
                await newTeacher.save();
                return next(new ExternalError(15));
            } catch (err) {
                console.log(err)
                if (err.is(5)) {
                    return next(new ExternalError(26));
                }
                return next(new ExternalError(14));
            }
        } else {
            throw err;
        }
    });
}

module.exports = TeacherController;