const express = require('express');
const api = express.Router();

const { CentroCostoController } = require('../controllers');


api.get('/v1/centrocosto/test', CentroCostoController.getCentroCosto);




module.exports = api;
