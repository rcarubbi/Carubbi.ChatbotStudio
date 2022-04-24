'use strict';
 
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


const directline = require("../src/bridge");
const app = require('../src/app')();
const normalizePort = require('normalize-port');
const port = normalizePort(process.env.PORT);

app.set('port', port);

directline.initializeRoutes(app, port, process.env.BOTENGINE_ENDPOINT);