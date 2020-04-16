'use strict';
const Promise = require('../../configs').Promise;
const InternalError = require('../../Models/Error/Internal');
const mongodb = Promise.promisifyAll(require('mongodb'));
const MongoClient = mongodb.MongoClient;

module.exports = async function(url, options) {
    const connection = await MongoClient.connectAsync(url, options).catch((err)=>{
        console.log(err);
        const error = new InternalError(1);
        throw error;
    });
    return connection;
};
