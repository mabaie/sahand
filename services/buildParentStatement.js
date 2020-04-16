'use strict';

module.exports = function buildParentStatement(fields, id){
    let out = {};
    for(let field in fields){
        switch(field){
            case 'haddress': out[id + '.haddress'] = fields['haddress'];delete fields['haddress'];break;
            case 'waddress': out[id + '.waddress'] = fields['waddress'];delete fields['waddress'];break;
        }
    }
    console.log(out);
    return out;
}
