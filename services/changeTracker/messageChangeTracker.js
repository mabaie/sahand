'use strict'

const ChangeTracker = require('./index');
const ObjectID = require('mongodb').ObjectId;

function MessageChangeTracker(db, collection, client){
    ChangeTracker.call(this, db, collection, client);
}

MessageChangeTracker.prototype = Object.create(ChangeTracker.prototype);

Object.defineProperty(MessageChangeTracker.prototype, 'constructor', {
    value: MessageChangeTracker,
    enumerable: false,
    writable: true
});

MessageChangeTracker.prototype.all = function(change){
    if(change.operationType === 'insert' || change.operationType === 'update'){
        const lastMessage=change.fullDocument.messages[change.fullDocument.messages.length-1];
        const contact1Id = change.fullDocument.contact1_id;
        const contact2Id = change.fullDocument.contact2_id;
        const messageId = change.fullDocument._id;

        let recieverId;
        if(new ObjectID(lastMessage.sender_id).toString() === new ObjectID(contact1Id).toString()){
            recieverId = contact2Id;
        } else {
            recieverId = contact1Id;
        }
        this.client.publish('/messages/'+recieverId, JSON.stringify({message_id: messageId}))
   }
    
}
module.exports = MessageChangeTracker;
