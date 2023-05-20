const express = require('express');
const api = express.Router();

const { ConsumoController } = require('../controllers');


api.get('/v1/consumos/detalleconsumos', ConsumoController.getDetalleConsumo);
api.post('/v1/consumos/registrarConsumo', ConsumoController.addConsumo);
api.get('/v1/consumos/:id_empresa', ConsumoController.getConsumosPorEmpresa);
api.get('/v1/consumos/:id_empresa/fecha', ConsumoController.getConsumosPorFecha);
api.get('/v1/consumos/:id_empresa/ccosto', ConsumoController.getConsumosCentroCosto);
api.get('/v1/consumos/:id_empresa/:id_cc/:fecha_desde/:fecha_hasta', ConsumoController.getConsumosPorCCFecha);

module.exports = api;