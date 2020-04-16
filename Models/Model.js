'use strict';

const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const InternalError = require('../Models/Error/Internal');
const assert = require('assert');

const createConnection = require('../services/database/createConnection');

function Model(name, connection, Schema, Validator) {
    // properties
    this.mname = name;
    this.connection = connection;
    this.Schema = Schema;
    this.Validator = Validator;
    this.mongoSchema = this.createSchema();
    //    this.createCollection();
}
Model.prototype.createSchema = function () {
    const finalSchema = this.Schema;
    _.merge(finalSchema, this.Validator);
    let docValidator = {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: [],
                properties: {},
            }
        }
    };

    for (let field in finalSchema) {

        docValidator.validator.$jsonSchema.properties[field] = {
            bsonType: this.getBsonType(finalSchema[field].type),
        };
        if (finalSchema[field].required) {
            docValidator.validator.$jsonSchema.required.push(field);
        }
    }
    // 
    return docValidator;
};
Model.prototype.getBsonType = function (obj) {
    switch (obj) {
        case String:
            return 'string';
        case Boolean:
            return 'bool';
        case Date:
            return 'date';
        case require('mongodb').ObjectId:
            return 'objectId';
        case Object:
            return 'object';
        case Number:
            return 'number';
        case Array:
            return 'array';
    }
};
Model.prototype.createIndexes = async function (collection) {
    const validator = this.Validator;
    const indexes = await collection.indexesAsync();
    let indexKeys = [];
    for (let index of indexes) {
        indexKeys.push(Object.keys(index.key)[0]);
    }
    for (let field in validator) {
        if ((field != '_id') && (indexKeys.indexOf(field) == -1)) {
            if (validator[field].unique) {
                let index = {};
                index[field] = 1;
                await collection.createIndexAsync(index, {
                    unique: true,
                });
            }
        }
    }
};

Model.prototype.createCollection = async function () {
    let flag = true;
    const connection = await createConnection(this.connection.url, this.connection.options);
    const db = connection.db(this.connection.dbName);
    db.listCollections().toArray((err, collections) => {
        for (let collection of collections) {
            if (collection.name == this.mname + 's') {
                //collection exists
                flag = false;
                let mongoCommand = {
                    collMod: this.mname + 's'
                };
                _.merge(mongoCommand, this.mongoSchema);
                mongoCommand.validationLevel = 'strict';
                db.commandAsync(mongoCommand).then(async () => {
                    await this.createIndexes(db.collection(this.mname + 's'));
                    connection.close();
                });
            }
        }

        if (flag && !err) {
            db.createCollectionAsync(this.mname + 's', this.mongoSchema).then(async () => {
                await this.createIndexes(db.collection(this.mname + 's'));
                connection.close();
            });
        }
    });
};

Model.prototype.createChangeTracker = async function (Tracker, client) {
    const connection = await createConnection(this.connection.url, this.connection.options);
    const db = connection.db(this.connection.dbName);
    this.changeTracker = new Tracker(db, this.mname + 's', client);
    return connection;
}

Model.prototype.save = async function (data) {
    const connection = await createConnection(this.connection.url, this.connection.options);
    const db = connection.db(this.connection.dbName);
    try {
        const r = await db.collection(this.mname + 's').insertOne(data);
        require('assert')(r.result.ok);
        connection.close();
    } catch (err) {
        connection.close();
        throw (err);
    }
    connection.close();
};

Model.prototype.findOne = async function (data) {
    const connection = await createConnection(this.connection.url, this.connection.options);
    const db = connection.db(this.connection.dbName);
    try {
        const docs = await db.collection(this.mname + 's').find(data).limit(1).toArray();
        assert.equal(docs.length, 1);
        connection.close();
        return docs;
    } catch (err) {
        connection.close();
        throw new InternalError(2);
    }
};
Model.prototype.findOneAndUpdate = async function (query, update, options = null) {
    if(_.isEqual(update['$set'], {})){
        return;
    }
    const connection = await createConnection(this.connection.url, this.connection.options);
    const db = connection.db(this.connection.dbName);
    try {
        console.log(query, update, options);
        const doc = await db.collection(this.mname + 's').findOneAndUpdate(query, update, options);
        console.log(doc);
        assert(doc.ok === 1);
        connection.close();
        return doc.value;
    } catch (err) {
        console.log(err);
        connection.close();
        throw new InternalError(2);
    }
}
Model.prototype.find = async function (data, skipNum, limitNum, project = null, sort ={_id: -1} ) {
    const connection = await createConnection(this.connection.url, this.connection.options);
    const db = connection.db(this.connection.dbName);
    try {
        let docs
        if (project) {
            docs = await db.collection(this.mname + 's').find(data).project(project).collation({locale: 'fa'}).sort(sort).skip(parseInt(skipNum, 10)).limit(parseInt(limitNum)).toArray();
        } else {
            docs = await db.collection(this.mname + 's').find(data).collation({locale: 'fa'}).sort(sort).skip(parseInt(skipNum, 10)).limit(parseInt(limitNum)).toArray();
        }
        assert(docs.length <= limitNum);
        connection.close();
        return docs;
    } catch (err) {
        connection.close();
        throw new InternalError(2);
    }
};

Model.prototype.delete = async function (query) {
    const connection = await createConnection(this.connection.url, this.connection.options);
    const db = connection.db(this.connection.dbName);
    try {
        const docs = await db.collection(this.mname + 's').deleteMany(query);
        assert.equal(docs.deletedCount, 1);
        connection.close();
        return docs.deletedCount;
    } catch (err) {
        connection.close();
        throw new InternalError(2);
    }
}
Model.prototype.addId = function (data) {

    const _data = {
        _id: new ObjectId(),
    };
    _.merge(_data, data);
    return _data;
};

module.exports = Model;