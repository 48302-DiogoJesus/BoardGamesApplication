'use strict'

const DEFAULT_PORT = 8888
const SERVER_PORT = process.argv[2] || DEFAULT_PORT

const test_user = "Zé", test_token = '4chwViN4QHCTyTnUud88ww'
const borga_data_mem = require('./borga-data-mem')(test_user, test_token)
const borga_games_data = require('./board-games-data');

const services = require('./borga-services')(borga_games_data, borga_data_mem)

const borga_queue = require('./borga-queue')

const web_api = require('./borga-web-api')(services, borga_queue)
const webui = require('./borga-webui')(services)

const express = require('express')
const app = express()

app.use('/api', web_api)
app.use('/', webui)

app.listen(SERVER_PORT, () => {
    console.log(`BORGA listening on port ${SERVER_PORT}`)
})