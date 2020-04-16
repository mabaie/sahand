function createData(count) {
    let data = [];
    for(let i = 0; i < count; i++){
        let newData = {
            FirstName: 'Mojtaba',
            LastName: 'Abaie',
            FatherName: 'Mohsen',
            ID: i,
            EducationalDegree: 'Diplom',
            Major: 'Computer',
            BirthDay: '2018-06-27T10:22:41+00:00',
            Job: 'None',
            Mobile: '9360707531',
            Email: 'mojtaba.abaie@gmail.com',
            Address: 'hjgjhgjgjgjhgjhgjgjhgjhgj',
        }
        data.push(JSON.parse(JSON.stringify(newData)));
    }
    return data;
}
export default createData;
