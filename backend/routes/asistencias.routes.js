const express = require('express');
const api = express.Router();

const { AsistenciaController } = require('../controllers');


api.get('/v1/asistencias/detalleasistencia', AsistenciaController.getDetalleAsistencia);
api.get('/v1/asistencias/:id_empresa', AsistenciaController.getAsistenciaPorEmpresa);
api.get("/v1/tiposasistencia", AsistenciaController.getTiposAsistencia);
api.post("/v1/addAsistencia", AsistenciaController.addAsistencia);
api.get("/v1/informeDetalleMes/:id_empresa", AsistenciaController.getInformeMensualAsisteConsume);
api.get("/v1/informemetricas/:id_empresa", AsistenciaController.getMetricas);


module.exports = api;