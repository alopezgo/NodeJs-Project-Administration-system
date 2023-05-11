const { pool } = require('../db/db');

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
  const query = {
    loginQuery: `SELECT   correo, contraseña 
                   FROM   sac.usuario 
                   WHERE  correo = $1 
                   AND    contraseña = $2`,
    values: [correo, contraseña],
  };

  const { rows } = await pool.query(query);

  if (rows.length === 0) {
    return { success: false, message: 'Correo o contraseña incorrectos' };
  }
  return { success: true, message: 'Inicio de sesión exitoso' };
}


exports.loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      throw new Error("Ingrese su correo y contraseña")
    }
    const resultado = await login(correo, contrasena);

    return res.status(200).send({
      success: true,
      message: "Inicio de sesión exitoso",
      Data: resultado
    })

  } catch (error) {
    console.error('Error al comprobar las credenciales', error);
    res.status(500).send('Error en el servidor');
  }
};

