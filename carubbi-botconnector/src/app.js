'use strict';

module.exports = () => {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    
    app.use(express.static("public"));
    app.use(bodyParser.json({
        limit: '20mb'
    }));

    app.use(bodyParser.urlencoded({
        extended: false,
        limit: '20mb'
    }));

    // enable cors
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, location");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        next();
    });

    return app;
}