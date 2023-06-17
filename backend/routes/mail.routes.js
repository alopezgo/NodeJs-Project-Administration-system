const express = require('express');
const api = express.Router();

const { MailController } = require('../controllers');


api.post('/v1/mail/recovery', MailController.sendEmail);

module.exports = api;