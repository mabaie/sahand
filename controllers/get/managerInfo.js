'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const SchoolModel = require('../../Models/school').SchoolModel;
const ExternalError = require('../../Models/Error/External');
const _ = require('lodash');

async function managerInfoController(req, res, next) {
    const body = req.body.valid.value;
    let filter = {
        userName: { $regex: `^${body.filter.ID}.*` },
        'type.manager': true
    }
    if(body.filter.ID === 'default') {
        filter.userName = {$regex: '^.*$'}
    }
    try {
        const managers = await UserModel.find(filter, body.skip, body.limit);
        for(let manager of managers) {
            delete manager.pass;
            const profile = await ProfileModel.findOne({_id: manager._id});
            _.merge(manager,profile[0]);
            const school = await SchoolModel.findOne({_id: manager._id});
            _.merge(manager, school[0]);
            delete manager.modified_at;
        }
        res.json(managers);
    } catch(err) {
        
        next(new ExternalError(25));
    }    
    
}

module.exports = managerInfoController;
