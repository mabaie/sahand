'use strict';

const Promise = global.Promise;

function createData(count) {
    let data = [];
    for(let i = 0; i < count; i++){
        let newData = {
            FirstName: 'مجتبی',
            LastName: 'عبایی شوشتری',
            FatherName: 'محسن',
            ID: i,
            EducationalDegree: 'دیپلم',
            Major: 'مهندسی کامپیوتر',
            BirthDay: '2018-06-27T10:22:41+00:00',
            Job: 'بیکار',
            Mobile: '9360707531',
            Email: 'mojtaba.abaie@gmail.com',
            Address: 'hjgjhgjgjgjhgjhgjgjhgjhgj',
        }
        data.push(JSON.stringify(newData));
    }
    return data;
}

const data = createData(1000)

function fetchcb(startId, count, query) {
    return new Promise(function(accept, reject){
        let dataCount = 0;
        let returnedData = [];
        for(let i = startId; i < data.length; i++) {
            if(JSON.parse(data[i]).ID == query.ID) {
                dataCount++;
                if(dataCount > count) {
                    break;
                }
                returnedData.push(data[i]);
            }
        }
        setTimeout(accept, 3000, returnedData);
    })
}

function Cache(size, blockSize, fetchcb) {
    this.size = size*blockSize;
    this.blockSize = blockSize;
    this.fetchcb = fetchcb;
    this.data = [];
    this.mongoCursor = 0;
    this.head = 0;
    this.tail = 0;
    this.full = false;
    this.lastQuery = {};
}
Cache.prototype.flush = function() {
    this.data = [];
    this.mongoCursor = 0;
    this.lastQuery = {};
    this.head = 0;
    this.tail = 0;
    this.full = false; 
}
Cache.prototype.find = async function(query, limit) {
    this.lastQuery = query;
    let returnedData = [];
    let fetchedDataLength = 0;
    if(this.lastQuery != query) {
        this.flush();
    }
    let occupiedSize = this.full ? this.size: this.tail - this.head;
    if(occupiedSize < 0){
        occupiedSize += this.size;
    }
    
    const count = limit - occupiedSize;
    
    if(count>0) {
        if(count > this.blockSize) {
            
            throw new Error();
        }
        const fetchedData = await fetchcb(this.mongoCursor, this.blockSize, query)
            .catch(()=>{})
        fetchedDataLength = fetchedData.length;
        
        for(let i = 0; i < fetchedData.length; i++) {
            this.data[this.tail] = fetchedData[i];
            this.tail = (this.tail+1) % this.size;
        }
        if(this.tail == this.head) {
            this.full = true;
        }
        
        this.mongoCursor += this.blockSize;
        
    }

    for(let i = 0; ((i < limit) && (i < occupiedSize+fetchedDataLength)); i++){
        returnedData.push(this.data[this.head]);
        if(this.full) {
            this.full = false;
        }
        this.head = (this.head + 1) % this.size;
    }
    

    return returnedData;
}
module.exports = {Cache, fetchcb};

/* const query = {
    ID: 2,
};
const cache = new Cache(3, 16, fetchcb);

cache.find(query, 2).then(data=>{
    
    cache.find(query, 4).then(data=>{
        
    }).catch(()=>{
        
    });
}).catch(()=>{
    
});
 */