'use strict';
function generatePass() {
    return Math.random().toString(36).slice(-8);
}
module.exports = generatePass;