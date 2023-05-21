const express = require('express');
const api = express.Router();

const { CentroCostoController } = require('../controllers');


api.get('/v1/centrocosto/:id_empresa', CentroCostoController.getCentroCosto);
api.get('/v1/empresas', CentroCostoController.getEmpresas);
api.get("/v1/tiposconsumo", CentroCostoController.getTiposConsumo);


module.exports = api;
