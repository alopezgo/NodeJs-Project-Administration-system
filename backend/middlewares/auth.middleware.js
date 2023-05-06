//modificar datos usuario para uso de token

const { User } = require('../models');
const { SECRET_USER_JWT } = require('../properties')
const { log } = require('../services')
const jwt = require('jwt-simple');
const moment = require('moment');

async function userTokenValidator(req, res, next) {

  try {
    if (!req.headers.authorization) {
      throw new Error("Este servicio requiere autenticación");
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    const decodedToken = jwt.decode(token, SECRET_USER_JWT);

    if (moment().unix() > decodedToken.end) {
      throw new Error("Autenticación no válida");
    }

    const user = await User.findOne({ _id: decodedToken._id }, "rut name lastname mail personal roles location area sapId position deleted");

    if (!user || user.deleted) {
      throw new Error("Autenticación no válida");
    }

   /* req.session = {
      _id: user._id,
      name: user.name,
      rut: user.rut,
      lastname: user.lastname,
      mail: user.mail,
      personal: user.personal,
      roles: user.roles,
      location: user.location,
      area: user.area,
      sapId: user.sapId,
      position : user.position
    }

    next();*/

  } catch (e) {

    return res.status(400).send({
      success: false,
      message: 'Error de autenticación',
      logout: true
    });

  }

};


async function queryParamsTokenValidator(req,res, next){

  if (req.query.token) {
    const token = req.query.token.replace(/['"]+/g, '');
    req.headers.authorization = token;
    next();
  }else if(req.headers.authorization){
    next();
  }else{
    return res.status(400).send({
      success: false,
      message: "Autenticación no válida"
    });
  }

}



module.exports = {
  userTokenValidator,
  queryParamsTokenValidator
}
