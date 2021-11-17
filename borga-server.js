'use strict'

const DEFAULT_PORT = 8888;
const SERVER_PORT = process.argv[2] || DEFAULT_PORT;

const borga_games_data = require('./board-games-data');
const borga_data_mem = require('./borga-data-mem');

const services = require('./borga-services')(borga_games_data, borga_data_mem);

const web_api = require('./borga-web-api')(services);

const express = require('express');
const app = express();

app.use('/api', web_api);

app.listen(SERVER_PORT, () => {
    console.log(`BORGA listening on port ${SERVER_PORT}`);
});