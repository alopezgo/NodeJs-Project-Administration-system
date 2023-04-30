const express = require('express');
const api = express.Router();

const { UsersController } = require('../controllers');



api.get('/v1/userTest', UsersController.getUser);




module.exports = api;
