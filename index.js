'use strict';
const configs = require('./configs');
const Sahand = require('./sahand');
const consoleView = require('debug')(configs.AppName);

process.on('uncaughtException', (err) => {
    consoleView('unhandeled exception hitted');
    consoleView(err.toString());
    throw err;
});
process.on('unhandledRejection', (reason, p) => {
    consoleView('Unhandled Rejection at:%O\treason: %O', p, reason);
    throw new Error();
    // application specific logging, throwing an error, or other logic here
});

const sahand = new Sahand(configs, consoleView);
sahand.init().catch((err) => {
    throw err;
});