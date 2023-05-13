const express = require('express');
const api = express.Router();

const { UsersController } = require('../controllers');


//api.get('/v1/user/authenticate/auth', UsersController.authenticate)
api.post('/v1/user/login', UsersController.loginUser);
api.get('/v1/userTest', UsersController.getUser);
api.post('/v1/addUser', UsersController.addUser);
api.put('/v1/deleteUser', UsersController.deleteUser);



module.exports = api;