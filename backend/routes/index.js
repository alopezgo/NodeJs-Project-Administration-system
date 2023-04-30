const express = require('express');
const router = express.Router();

router.use('/', require('./centroCosto.routes'));
router.use('/', require('./users.routes'));
router.use('/', require('./permisos.routes'));


module.exports = router;