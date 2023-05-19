const express = require('express');
const api = express.Router();

const { AsistenciaController } = require('../controllers');


api.get('/v1/asistencias/detalleasistencia', AsistenciaController.getDetalleAsistencia);
api.get('/v1/asistencias/:id_empresa', AsistenciaController.getAsistenciaPorEmpresa);



module.exports = api;