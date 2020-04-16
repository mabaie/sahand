module.exports = function buildSchoolStatement(fields){
    let out = {};
    for(let field in fields){
        switch(field){
            case 'sname': out['sname'] = fields['sname']; delete fields['sname'];break;
            case 'stype': out['stype'] = fields['stype']; delete fields['stype'];break;
       }
    }
    console.log(out)
    return out;
}