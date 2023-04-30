const express = require('express');
const api = express.Router();

const { PermisosController } = require('../controllers');


api.get('/v1/permisos/detallepermiso', PermisosController.getDetallePermiso);




module.exports = api;
