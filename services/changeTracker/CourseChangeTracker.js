'use strict'

const ChangeTracker = require('./index');
const ChildrenModel = require('../../Models/children').ChildrenModel;

const ObjectID = require('mongodb').ObjectId;
const _ = require('lodash');

function CourseChangeTracker(db, collection, client){
    ChangeTracker.call(this, db, collection, client);
    this.handleChange = {
        abscence: this.abscence.bind(this),
    }
    this.pipelines = {
        abscence: { fullDocument: 'updateLookup' },
    }
}

CourseChangeTracker.prototype = Object.create(ChangeTracker.prototype);

Object.defineProperty(CourseChangeTracker.prototype, 'constructor', {
    value: CourseChangeTracker,
    enumerable: false,
    writable: true
});

CourseChangeTracker.prototype.abscence = function(change){
    if(change.operationType === 'update' && change.updateDescription.updatedFields.attendance){
        const attendance = change.updateDescription.updatedFields.attendance;
        const lastAttendance = change.fullDocument.lastAttendance;
        const presents = attendance[lastAttendance][0].present;
        const allStudents = change.fullDocument.students;
        const abscents = _.differenceWith(allStudents, presents, _.isEqual);
        const courseID = change.fullDocument._id;
        abscents.map(abscent=>{
            ChildrenModel.findOne({_id: new ObjectID(abscent)}).then(parents=>{
                const parentOne = parents[0].parentOne;
                const parentTwo = parents[0].parentTwo;
                if(parentTwo){
                    this.client.publish('/abscence/'+parentTwo, JSON.stringify({course_id: courseID, date: lastAttendance}))
                }
                this.client.publish('/abscence/'+parentOne, JSON.stringify({course_id: courseID, date: lastAttendance}))
            })
        })
   }
    
}
module.exports = CourseChangeTracker;
