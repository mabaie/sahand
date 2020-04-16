const Class = require('../../Models/class').Class;
const ClassModel = require('../../Models/class').ClassModel;
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectID;
const jMoment = require('moment-jalaali');

async function ClassController(req, res, next) {
    const body = req.body.valid.value;
    let year = jMoment(new Date);
    if(year.jMonth() < 4 && year.jMonth() >0){
        year.subtract(1, 'jYear');
    }
    console.log(req.data._id)
    ClassModel.findOne({
        school_id: new ObjectID(req.data._id),
        cname: body.Name,
        grade: body.Grade,
        year: new Date(year.startOf('jYear').toISOString()),
    }).then(() => {
        return next(new ExternalError(13));
    }).catch(async (err) => {
        if (err.is(2)) {
            try {
                const newClass = new Class({
                    cname: body.Name,
                    year: new Date(year.startOf('jYear').toISOString()),
                    grade: body.Grade,
                    capacity: parseInt(body.Capacity),
                    modified_at: new Date(),
                    school_id: new ObjectID(req.data._id)
                });
                await newClass.save();
                return next(new ExternalError(15));
            } catch (err) {
                
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

module.exports = ClassController;