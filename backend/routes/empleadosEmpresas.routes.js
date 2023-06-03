const express = require('express');
const api = express.Router();

const { EmpleadosEmpresaController } = require('../controllers');


api.get('/v1/empleados/:id_empresa', EmpleadosEmpresaController.getEmpleadosPorEmpresa);

module.exports = api;