const express = require('express');
const api = express.Router();

const { InfoController } = require('../controllers');


api.get('/v1/sacData', InfoController.downloadData);

module.exports = api;