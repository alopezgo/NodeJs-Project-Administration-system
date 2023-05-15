const express = require('express');
const api = express.Router();

const { ConsumoController } = require('../controllers');


api.get('/v1/consumos/detalleconsumos', ConsumoController.getDetalleConsumo);
api.post('/v1/consumos/registrarConsumo', ConsumoController.addConsumo);
api.get('/v1/consumos/:id_empresa', ConsumoController.getConsumosPorEmpresa);



module.exports = api;