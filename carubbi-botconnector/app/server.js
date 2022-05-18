'use strict';
import * as directline from '../src/directline/bridge.js';
import express from 'express';
import dotenv from 'dotenv';
import normalizePort from 'normalize-port';

const app = express(); 
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const port = normalizePort(process.env.PORT);

app.set('port', port);


directline.initializeRoutes(app, port, process.env.BOTENGINE_ENDPOINT, true);

