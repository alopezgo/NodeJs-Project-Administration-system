const express = require('express');
const router = express.Router();

router.use('/', require('./centroCosto.routes'));
router.use('/', require('./users.routes'));
router.use('/', require('./permisos.routes'));
router.use('/', require('./consumos.routes'));
router.use('/', require('./asistencias.routes'));
router.use('/', require('./empleadosEmpresas.routes'));


module.exports = router;