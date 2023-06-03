const express = require('express');
const api = express.Router();

const { PermisosController } = require('../controllers');


api.get('/v1/permisos/detallepermiso', PermisosController.getDetallePermiso);
api.get("/v1/permisos/:id_empresa", PermisosController.getPermisoPorEmpresa);
api.post("/v1/registrarPermiso", PermisosController.postRegistroPermiso);
api.get('/v1/permisos/asistenciapermiso', PermisosController.getAsistenciaPermiso);
api.get("/v1/tipospermiso", PermisosController.getTiposPermiso);


module.exports = api;
