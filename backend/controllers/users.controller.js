const { pool } = require('../db/db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUser = async (req, res) => {
  try {
    const query = 'SELECT * FROM sac.usuario';
    const result = await pool.query(query);

    console.log("BD DATA: ", result.rows)

    return res.status(200).send({
      success: true,
      message: "usuario encontrado",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener los usuarios', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.postCreatUser = async (req, res) => {
  try {

      //funcionalidades crear usuario

    return res.status(200).send({
      success: true,
      message: "usuario encontrado",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener los usuarios', error);
    res.status(500).send('Error en el servidor');
  }
};

async function login(correo, contraseña) {
  const query =`SELECT  correo, contrasena 
                   FROM   sac.usuario 
                   WHERE  correo = $1 
                   AND    contrasena = $2
                   AND id_rol in (1,2)`;

  const { rows } = await pool.query(query, [correo, contraseña]);

  if (rows.length === 0) {
    return { success: false, message: 'Correo o contraseña incorrectos', data: null };
  }
  return { success: true, message: 'Login exitoso', data: rows };
}


exports.loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const resultado = await login(correo, contrasena);
    if (resultado.success == true) {
      return res.status(200).json(resultado);
    } else {
      return res.status(404).json(resultado);
    }
  } catch (error) {
    console.error('Error con la conexión a la base de datos', error);
    res.status(500).send(error);
  }
};

// const otrafuncion = async () => {
//   console.log(await login('adminempresa1@gmail.com', 'pass123'));
// }
// otrafuncion();

