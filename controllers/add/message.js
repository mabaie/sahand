'use strict';

const {
    ChatModel,
    Chat
} = require('../../Models/chat');
const ObjectID = require('mongodb').ObjectID;
const UserModel = require('../../Models/user').UserModel;
const External = require('../../Models/Error/External');

async function addName(input, id) {
    let user = await UserModel.findOne({
        _id: id
    });
    user = user[0];
    input.contact1_fname = user.fname;
    input.contact1_lname = user.lname;
}

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    let qout;
    let pin = {};
    const sender_id = new ObjectID(req.data._id);
    const reciver_id = new ObjectID(body.reciver);
    const date = new Date();
    try {
        if (body.chat_id) {
            //get from database
            const chat_id = new ObjectID(body.chat_id);
            qout = await ChatModel.findOne({
                _id: chat_id
            });
            qout = qout[0];
            qout.messages.push({
                sender_id: sender_id,
                date: date,
                text: body.message
            });
            await ChatModel.findOneAndUpdate({
                _id: chat_id
            }, {
                $set: qout
            }, {
                upsert: false
            })
            qout.messages = qout.messages.slice(-parseInt(body.limit));
            if (qout.contact1_id.toString() === sender_id.toString()) {
                qout.contact1_id = qout.contact2_id;
            }
            delete qout.contact2_id;
            await addName(qout, qout.contact1_id);
            res.json(qout);
        } else {
            qout = await ChatModel.findOne({
                $or: [{
                    contact1_id: sender_id,
                    contact2_id: reciver_id
                }, {
                    contact1_id: reciver_id,
                    contact2_id: sender_id
                }]
            }).catch(async err => {
                if (err.is(2)) {
                    pin._id = new ObjectID();
                    pin.modified_at = date;
                    pin.contact1_id = sender_id;
                    pin.contact2_id = reciver_id
                    pin.messages = [{
                        sender_id: sender_id,
                        date: date,
                        text: body.message
                    }];
                    const chat = new Chat(pin);
                    await chat.save();
                    qout = {
                        chat_id: pin._id,
                        contact1_id: pin.contact2_id,
                        messages: pin.messages,
                    }
                    await addName(qout, qout.contact1_id);
                    res.json(qout);
                }
            })
            if (qout) {
                qout = qout[0];
                qout.messages.push({
                    sender_id: sender_id,
                    date: date,
                    text: body.message
                });
                await ChatModel.findOneAndUpdate({
                    _id: qout._id
                }, {
                    $set: qout
                }, {
                    upsert: false
                })
                qout.messages = qout.messages.slice(-parseInt(body.limit));
                if (qout.contact1_id.toString() === sender_id.toString()) {
                    qout.contact1_id = qout.contact2_id;
                }
                delete qout.contact2_id;
                qout.chat_id = qout._id;
                delete qout._id;
                await addName(qout, qout.contact1_id);
                res.json(qout);
            }
        }

    } catch (err) {
        console.log(err);
        if (err.is(2)) {
            return next(new External(25))
        }
        next(new Error())
    }
}