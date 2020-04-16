'use stric';
const ChatModel = require('../../Models/chat').ChatModel;
const ObjectID = require('mongodb').ObjectID;
const External = require('../../Models/Error/External');

module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    const chat_id = new ObjectID(req.params.id);
    try {
        await ChatModel.findOneAndUpdate({
            _id: chat_id
        }, {
            $pull: {
                messages: {
                    sender_id: new ObjectID(body.sender_id),
                    date: new Date(body.date)
                }
            }
        }, {
            multi: true
        });
        res.json({
            success: 1
        });
    } catch (err) {
        console.log(err);
        if (err.is(2)) {
            return next(new External(25))
        }
        next(new Error())
    }
}