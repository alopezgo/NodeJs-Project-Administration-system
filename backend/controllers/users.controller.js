const { pool } = require("../db/db");
const bcrypt = require("bcrypt");
const { login, deleteUser } = require("../services/user.services");
const { mailValidation } = require("../services/mail.services");


exports.getUser = async (req, res) => {
  try {
    const query = "SELECT * FROM sac.usuario";
    const result = await pool.query(query);

    console.log("BD DATA: ", result.rows);

    return res.status(200).send({
      success: true,
      message: "usuario encontrado",
      Data: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    res.status(500).send("Error en el servidor");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena){
      return res.status(400).send({ success: false, message: "Se requiere correo y contraseña para iniciar sesión" });
    }
    if (!mailValidation(correo)) {
      return res.status(400).send({ success: false, message: "No es un formato válido de correo" });
    }
    const resultado = await login(correo, contrasena);
    if (resultado.success == true) {
      return res.status(200).json(resultado);
    } else {
      return res.status(404).json(resultado);
    }
  } catch (e) {
    console.error("Error con la conexión a la base de datos", e);
    res.status(500).send(e);
  }
};

exports.addUser = async (req, res) => {
  try {
    const { id_rol, correo, contrasena } = req.body;
    if (!correo || !contrasena){
      return res.status(400).send({ success: false, message: "Se requiere correo y contraseña para iniciar sesión" });
    }
    if (!mailValidation(correo)) {
      return res.status(400).send({ success: false, message: "No es un formato válido de correo" });
    }
    // Verifica si el correo ya existe en la tabla de usuario
    const query = 'SELECT COUNT(*) AS count FROM sac.usuario WHERE correo = $1';
    const { rows } = await pool.query(query, [correo]);
    const count = rows[0].count;
    if (count > 0) {
      return res.status(400).send({
        success: false,
        message: 'El correo ingresado ya existe',
      });
    }

    // Encriptación de la password
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    //establece siempre id_estado en 1, es decir, como activo
    //la fecha se establece siempre como la fecha actual
    const insertQuery = 'INSERT INTO sac.usuario (id_estado, id_rol, correo, contrasena, created_at) VALUES (1, $1, $2, $3, NOW())';
    await pool.query(insertQuery, [id_rol, correo, hashedPassword]);

    return res.status(200).send({
      success: true,
      message: 'Usuario insertado con éxito',
    });
  } catch (error) {
    console.error('Error al insertar usuario', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { correo } = req.body;
    await deleteUser(correo);
    return res.status(200).send({
      success: true,
      message: 'Usuario eliminado con éxito',
    });
  } catch (error) {
    console.error('Error al eliminar usuario', error);
    res.status(500).send('Error en el servidor');
  }
};