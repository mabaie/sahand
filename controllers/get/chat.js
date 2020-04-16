'use strict';
const ChatModel = require('../../Models/chat').ChatModel;
const ObjectID = require('mongodb').ObjectID;
const External = require('../../Models/Error/External');
const UserModel = require('../../Models/user').UserModel;

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    const chatID = new ObjectID(req.params.id);
    try {
        const chat = (await ChatModel.findOne({
            _id: chatID
        }))[0];
        const start = Math.max(chat.messages.length - (parseInt(body.skip) + parseInt(body.limit)), 0);
        const end = Math.max(chat.messages.length - parseInt(body.skip), 0)
        chat.chat_list = chat.messages.slice(start, end)
        delete chat._id;
        delete chat.messages;
        if (chat.contact1_id.toString() === req.data._id.toString()) {
            chat.contact_id = chat.contact2_id;
        } else {
            chat.contact_id = chat.contact1_id;
        }
        delete chat.contact1_id;
        delete chat.contact2_id;
        const user = (await UserModel.findOne({
            _id: new ObjectID(chat.contact_id)
        }))[0];
        chat.contact_fname = user.fname;
        chat.contact_lname = user.lname;
        res.json(chat);
    } catch (err) {
        console.log(err);
        if (err.is(2)) {
            return next(new External(25));
        }
    }
}