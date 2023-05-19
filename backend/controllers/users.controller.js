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
    const { nombre_empresa, id_rol, rut, dv, nombre, ap_paterno, ap_materno, correo, contrasena } = req.body;
    if (!correo || !contrasena){
      return res.status(400).send({ success: false, message: "Se requiere correo y contraseña para iniciar sesión" });
    }
    if (!mailValidation(correo)) {
      return res.status(400).send({ success: false, message: "No es un formato válido de correo" });
    }

    // Obtiene el ID de la empresa a partir del nombre
    const empresaQuery = 'SELECT id FROM sac.empresa WHERE nombre = $1';
    const { rows: empresaRows } = await pool.query(empresaQuery, [nombre_empresa]);
    if (empresaRows.length === 0) {
      return res.status(400).send({
        success: false,
        message: 'La empresa ingresada no existe',
      });
    }

    const id_empresa = empresaRows[0].id;

    // Verifica si el correo ya existe en la tabla de usuario
    const correoQuery = 'SELECT COUNT(*) AS count FROM sac.usuario WHERE correo = $1';
    const { rows: correoRows } = await pool.query(correoQuery, [correo]);
    const count = correoRows[0].count;
    if (count > 0) {
      return res.status(400).send({
        success: false,
        message: 'El correo ingresado ya existe',
      });
    }

    // Encriptación de la password
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    //establece el estado y la fecha actual
    const insertQuery = 'INSERT INTO sac.usuario (id_estado, id_rol, id_empresa, rut, dv, nombre, ap_paterno, ap_materno, correo, contrasena, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())';
    await pool.query(insertQuery, [1, id_rol, id_empresa, rut, dv, nombre, ap_paterno, ap_materno, correo, hashedPassword]);

    return res.status(200).send({
      success: true,
      message: 'Usuario insertado con éxito',
      nombre_empresa: nombre_empresa //añade el nombre de la empresa al objeto de respuesta
    });
  } catch (error) {
    console.error('Error al insertar usuario', error);
    res.status(500).send('Error en el servidor');
  }
}



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

//Usuarios por empresa para ser utilizado en vista usuarios
exports.getUserPorEmpresa = async (req, res) => {
  try {
    const { id_empresa } = req.params;
    const { id_usuario } = req.params;

    // Ejecutar la consulta
    const query = `
      Select concat(nombre,' ', ap_paterno,' ', ap_materno) as usuario, rol, 
      correo, date(created_at) as fecha_creacion
      from sac.usuario as u
      join sac.rol as r on u.id_rol = r.id
      where u.id_rol !=1
      and u.id_estado=1
      and u.id_empresa= $1
      and u.id != $2;`;

    const { rows } = await pool.query(query, [id_empresa, id_usuario]);

    // Devolver los resultados en formato JSON
    return res.status(200).json({
      success: true,
      message: "Usuarios por Empresa obtenidos con éxito",
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener los usuarios por empresa", error);
    return res.status(500).send("Error en el servidor");
  }
};