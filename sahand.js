'use strict';
const express = require('express');
const morgan = require('morgan');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

const initModels = require('./Models');
const router = require('./routes');
const errorHandler = require('./controllers/Error');
const http = require('http');
const faye = require('faye');
var helmet = require('helmet')
var compression = require('compression');
var cluster = require('cluster');

function Sahand(configs, consoleView) {
    this.configs = configs;
    this.consoleView = consoleView;
}
Sahand.prototype.init = async function () {
    if (cluster.isMaster) {  
        for (var i = 0; i < this.configs.cpuNum; i++) {
            // Create a worker
            cluster.fork();
        }
    } else {
        //pass faye client to express
        const bayeux = new faye.NodeAdapter({mount: '/notifs'});
        //Initialize data models
        this.openConnections = await initModels(this.configs, bayeux.getClient());

        //Initialize server
        const app = new express();
        app.use(compression());
        app.use(helmet());

        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        //app level middlewares
        app.use(morgan('dev'));
        //app.use(bodyParser.json());
        //app.use(express.json({limit: '25mb'}));
        //app.use(express.urlencoded({limit: '25mb'}));
        //attach router
        app.use('/', (req, res, next)=>{
            bayeux.getClient().publish('/messages', {
                text: 'connection established'
            })
            next();
        }, router); 
        app.use(errorHandler);
        //attach faye
        this.server = http.createServer(app);
        bayeux.attach(this.server);
        process.on('SIGINT', this.closeConnections.bind(this));

        this.server.listen(this.configs.port, ()=>{
            this.consoleView(`Sahand is listening on ${this.configs.host}:${this.configs.port}`);
        });
    }
};

Sahand.prototype.closeConnections = function() {
    for(let connection of this.openConnections) {
        connection.close();
    }
}
module.exports = Sahand;
