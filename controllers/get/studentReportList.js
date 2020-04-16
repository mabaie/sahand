"use strict";
const ProfileModel = require("../../Models/profile").ProfileModel;
const UserModel = require("../../Models/user").UserModel;
const ClassModel = require("../../Models/class").ClassModel;
const CourseModel = require("../../Models/course").CourseModel;
const configs = require('../../configs');
const ObjectID = require('mongodb').ObjectID;
var jmoment_123 = require('jalali-moment');
const _ = require('lodash');

/*
  {
    register_min:this.state.registerMin.toISOString(),
    register_max:this.state.registerMax.toISOString(),
    birth_min:this.state.birthMin.toISOString(),
    birth_max:this.state.birthMax.toISOString(),
    birth_month:this.state.birthMonth,
    grade: this.state.grade==0 ? "default": this.grades[this.state.grade],
    cname: this.state.cname==0 ? "default": this.cnames[this.state.cname]
  }
*/
module.exports = async function(req, res, next) {
  const school_id = new ObjectID(req.data._id)
  const query = req.body.valid.value
  console.log(query);
  /*let students = ProfileModel.find({
    $and:[
      {birthday:{$gte:new Date(query.birth_min)}},
      {birthday:{$lte:new Date(query.birth_max)}}
    ]
    ,
    modified_at:{
      $and:[
        {$gte:new Date(query.modified_at)},{$lte:new Date(query.register_max)}
      ]
    },
    grade: query.grade==='default'? { $exists: true } : {$eq:query.grade}
  },0,1000)*/
  let students = await ProfileModel.find({
    $and:[
      {birthday:{$gte:new Date(query.birth_min)}},
      {birthday:{$lte:new Date(query.birth_max)}},
      {modified_at:{$gte:new Date(query.register_min)}},
      {modified_at:{$lte:new Date(query.register_max)}}
    ],
    grade: query.grade==='default'? { $exists: true } : {$eq:query.grade}
  },0,10000);
  if(query.birth_month!==0)
    students = students.filter(s=>{
      return parseInt(jmoment_123(new Date(s.birthday)).locale('fa').format('MM')) === query.birth_month
    })
  if(query.cname!=='default'){
    students=await Promise.all(students.map(async s=>{
      try{
        const classList = await ClassModel.findOne({school_id:school_id, cname:query.cname})
        const colist = await CourseModel.find({class_id:classList[0]._id},0,100);
        for(let c in colist){
          if(colist[c].students.find(e=>{
            return _.isEqual(e,s._id.toString())
          })!=undefined)
            return s;
        }
        s['delete']= true;
        return s;
      }catch(err){
        s['delete']= true;
        return s;
      }
    }))
    students = students.filter(s=>{
      return !s.hasOwnProperty('delete');
    })
  }
  students=await Promise.all(students.map(async s=>{
    try{
      let user = await UserModel.findOne({_id:s._id,school_id:school_id})
      s = _.merge(s,user[0]);
      delete s.last_login;
      delete s.type;
      delete s.firstLogin;
      delete s.canLogin;
      delete s.isActive;
      delete s.pass;
      return s;
    }catch(err){
      s['delete']= true;
      return s;
    }
  }))

  students = students.filter(s=>{
    return !s.hasOwnProperty('delete');
  })
  res.json(students);
};
