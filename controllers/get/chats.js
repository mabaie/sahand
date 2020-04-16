'use strict';
const ObjectID = require('mongodb').ObjectID;
const ChatModel = require('../../Models/chat').ChatModel;
const UserModel = require('../../Models/user').UserModel;
async function getChatsController(req, res, next) {
    const body = req.body.valid.value;
    const req_id = new ObjectID(req.data._id);
    try {
        let chats = await ChatModel.find({
            $or: [{
                contact1_id: req_id
            }, {
                contact2_id: req_id
            }]
        }, body.skip, body.limit);
        await Promise.all(chats.map(async element => {
            let contact_id;
            delete element.messages;
            if (element.contact1_id.toString() === req_id.toString()) {
                contact_id = element.contact2_id;
            } else {
                contact_id = element.contact1_id;
            }
            delete element.contact1_id;
            delete element.contact2_id;
            const contact = (await UserModel.findOne({
                _id: new ObjectID(contact_id)
            }))[0];
            element.contact_fname = contact.fname;
            element.contact_lname = contact.lname;
            console.log(element);
        }));
        res.json(chats);
    } catch (err) {
        next(err);
    }
}

module.exports = getChatsController;