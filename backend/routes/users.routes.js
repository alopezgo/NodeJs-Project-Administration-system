const express = require('express');
const api = express.Router();

const { UsersController } = require('../controllers');


//api.get('/v1/user/authenticate/auth', UsersController.authenticate)
api.post('/v1/user/login', UsersController.loginUser);
api.post('/v1/user/loginApp', UsersController.loginUserApp);
api.post('/v1/addUser', UsersController.addUser);
api.put('/v1/deleteUser', UsersController.deleteUser);
api.get('/v1/usuarios/:id_usuario/:id_empresa', UsersController.getUserPorEmpresa);
api.put('/v1/usuarios/update/:id', UsersController.updateUser);
api.put('/v1/usuarios/:id_usuario/updatePass', UsersController.updatePasswordApp);
api.put('/v1/usuarios/estado/:id', UsersController.updateUserStatus);
api.post('/v1/usuarios/info/:id_usuario/:id_empresa', UsersController.infoUser);
api.post('/v1/usuarios/recovery', UsersController.recovery);

//user por id

api.get('/v1/usuarios/:id', UsersController.getUserPorId);


module.exports = api;