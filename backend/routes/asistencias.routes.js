const express = require('express');
const api = express.Router();

const { AsistenciaController } = require('../controllers');


api.get('/v1/asistencias/detalleasistencia', AsistenciaController.getDetalleAsistencia);



module.exports = api;