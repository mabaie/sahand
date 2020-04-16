'use strict';

const createModel = require('../createModel');

function Chat(data) {
    //private properties
    let _data;
    this.setData =function(data) {
        _data = data;
    };
    this.getData = function () {
        return _data;
    };
    this.setData(this.addId(data));
}

function ChatModel() {

}
function createChatModel(name, connection, Schema, Validator) {
    createModel.call(ChatModel, Chat, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Chat.prototype,ChatModel);
    Chat.prototype.constructor = Chat;

}

module.exports = {
    createChatModel: createChatModel,
    ChatModel: ChatModel, 
    Chat: Chat
};