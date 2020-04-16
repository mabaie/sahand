'use strict';

function ChangeTracker(db, collection, client) {
    this.db = db;
    this.collection = collection;
    this.changeStreams = [];
    this.handleChange = {
        all: this.all.bind(this),
    }
    this.pipelines = {
        all: { fullDocument: 'updateLookup' },
    }
    this.client = client;
}
ChangeTracker.prototype.addTracker = function(tracker) {
    this.changeStreams.push(this.db.collection(this.collection)
        .watch(this.pipelines[tracker]));
    this.changeStreams[this.changeStreams.length - 1]
        .on('change', this.handleChange[tracker]);
}
ChangeTracker.prototype.all = function(change){
    this.client.publish('/messages', JSON.stringify({_id: change.fullDocument._id}))
}

module.exports=ChangeTracker;