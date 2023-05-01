const express = require('express');
const api = express.Router();

const { ConsumoController } = require('../controllers');


api.get('/v1/consumos/detalleconsumos', ConsumoController.getDetalleConsumo);



module.exports = api;