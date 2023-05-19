const express = require('express');
const api = express.Router();

const { PermisosController } = require('../controllers');


api.get('/v1/permisos/detallepermiso', PermisosController.getDetallePermiso);
api.get("/v1/permisos/:id_empresa", PermisosController.getPermisoPorEmpresa);
api.get('/v1/permisos/asistenciapermiso', PermisosController.getAsistenciaPermiso);



module.exports = api;
