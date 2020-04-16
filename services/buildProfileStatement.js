const jMoment = require('moment-jalaali');
module.exports = function buildProfileStatement(fields){
    let out = {};
    for(let field in fields){
        switch(field){
            case 'faname': out['faname'] = fields['faname']; delete fields['faname'];break;
            case 'degree': out['degree'] = fields['degree']; delete fields['degree'];break;
            case 'major': out['major'] = fields['major']; delete fields['major'];break;
            case 'mobile': out['mobile'] = fields['mobile']; delete fields['mobile'];break;
            case 'email': out['email'] = fields['email']; delete fields['email'];break;
            case 'address': out['address'] = fields['address']; delete fields['address'];break;
            case 'birthday': out['birthday'] = new Date(fields['birthday']); delete fields['birthday'];break;
            case 'grade': 
                out['grade'] = fields['grade']; 
                let year1 = jMoment(new Date());
                if(year1.jMonth() <= 4 && year1.jMonth() >0){
                    year1.subtract(1, 'jYear');
                }
                console.log('school_id is ',fields['school_id'])
                out['academic_year'] = [{school_id:fields['school_id'],year: new Date(year1.startOf('jYear').toISOString()),grade:fields['grade']}];
                delete fields['academic_year'];
                delete fields['grade'];
                break;
            case 'image': out['image'] = fields['image']; delete fields['image'];break;
            case 'birthPlace': out['birthPlace'] = fields['birthPlace']; delete fields['birthPlace'];break;
            case 'issuePlace': out['issuePlace'] = fields['issuePlace']; delete fields['issuePlace'];break;
            case 'religion': out['religion'] = fields['religion']; delete fields['religion'];break;
            case 'mazhab': out['mazhab'] = fields['mazhab']; delete fields['mazhab'];break;
            case 'citizenship': out['citizenship'] = fields['citizenship']; delete fields['citizenship'];break;
            case 'homePhone': out['homePhone'] = fields['homePhone']; delete fields['homePhone'];break;
            case 'job': out['job'] = fields['job']; delete fields['job'];break;
        }
    }
    return out;
}
