'use strict'
const UserModel = require('../../../Models/user').UserModel;
const ChildrenModel = require('../../../Models/children').ChildrenModel;
const ObjectID = require('mongodb').ObjectID;
module.exports = async function(req, res, next){
    const parentID = req.data._id;
    console.log(req.data._id)
    let childs = await ChildrenModel.find(
        {$or: [
            {parentOne: new ObjectID(parentID)},
            {parentTwo: new ObjectID(parentID)}
        ]}, 0, 100000);
    await Promise.all(
        childs.map(async (child)=>{
            const profile = await UserModel.findOne({_id: new ObjectID(child._id)});
            console.log(profile)
            child['fname']=profile[0].fname;
            child['lname']=profile[0].lname;
        })
    )
    res.json(childs);
}