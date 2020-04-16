'use strict';

const createModel = require('../createModel');

function SettingAppointment(data) {
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

function SettingAppointmentModel() {

}
function createSettingAppointmentModel(name, connection, Schema, Validator) {
    createModel.call(SettingAppointmentModel, SettingAppointment, name, connection, Schema, Validator); 
    Object.setPrototypeOf(SettingAppointment.prototype,SettingAppointmentModel);
    SettingAppointment.prototype.constructor = SettingAppointment;

}


module.exports = {
    createSettingAppointmentModel: createSettingAppointmentModel,
    SettingAppointmentModel: SettingAppointmentModel, 
    SettingAppointment: SettingAppointment
};