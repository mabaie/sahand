module.exports = function buildUserStatement(fields){
    let out = {};
    for(let field in fields){
        switch(field){
            case 'fname': out['fname'] = fields['fname']; delete fields['fname'];break;
            case 'lname': out['lname'] = fields['lname']; delete fields['lname'];break;
            case 'userName': out['userName'] = fields['userName']; delete fields['userName'];break;
            case 'canLogin': out['canLogin'] = fields['canLogin']; delete fields['canLogin'];break;
            case 'isActive': out['isActive'] = fields['isActive']; delete fields['isActive'];break;
        }
    }
    console.log(out)
    return out;
}