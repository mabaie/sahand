'use strict';

const createModel = require('../createModel');

function CalendarEvent(data) {
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

function CalendarEventModel() {

}
function createCalendarEventModel(name, connection, Schema, Validator) {
    createModel.call(CalendarEventModel, CalendarEvent, name, connection, Schema, Validator); 
    Object.setPrototypeOf(CalendarEvent.prototype,CalendarEventModel);
    CalendarEvent.prototype.constructor = CalendarEvent;

}

module.exports = {
    createCalendarEventModel: createCalendarEventModel,
    CalendarEventModel: CalendarEventModel, 
    CalendarEvent: CalendarEvent
};