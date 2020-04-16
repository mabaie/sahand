'use strict'

const ChangeTracker = require('./index');
const ObjectID = require('mongodb').ObjectId;
const CourseModel = require('../../Models/course').CourseModel;
const ChildrenModel = require('../../Models/children').ChildrenModel;

function AssignmentChangeTracker(db, collection, client){
    ChangeTracker.call(this, db, collection, client);
}

AssignmentChangeTracker.prototype = Object.create(ChangeTracker.prototype);

Object.defineProperty(AssignmentChangeTracker.prototype, 'constructor', {
    value: AssignmentChangeTracker,
    enumerable: false,
    writable: true
});

AssignmentChangeTracker.prototype.all = async function(change){
    if(change.operationType === 'update' || change.operationType === 'insert'){
       const courseID = change.fullDocument.courseID;
       const assignmentID = change.fullDocument._id;
       let course = await CourseModel.findOne({_id: new ObjectID(courseID)});
       course = course[0];
       await Promise.all(course.students.map(async student=>{
           let parents = await ChildrenModel.findOne({_id: new ObjectID(student)});
           parents = parents[0];
           this.client.publish('/assignments/'+parents.parentOne, JSON.stringify({assignment_id: assignmentID}));
           if(parents.parentTwo){
               this.client.publish('/assignments/'+parents.parentTwo, JSON.stringify({assignment_id: assignmentID}));
           }
       }));
   }
    
}
module.exports = AssignmentChangeTracker;
