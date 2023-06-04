const { pool } = require("../db/db");
const bcrypt = require("bcrypt");
const { login, deleteUser, validatePassword } = require("../services/user.services");
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

//Funcion login actualizada
exports.loginUser = async (req, res) => {
  try {
    console.log('body', req.body)
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
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

//Actualizado con nuevas validaciones
exports.addUser = async (req, res) => {
  try {
    console.log('body', req.body)
    const { id_empresa, id_rol, rut, dv, nombre, ap_paterno, ap_materno, correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).send({ success: false, message: "Se requiere correo y contraseña para iniciar sesión" });
    }
    if (!mailValidation(correo)) {
      return res.status(400).send({ success: false, message: "No es un formato válido de correo" });
    }
    //Validar id_empresa como número y que no sea vacío o null
    if (!id_empresa || typeof id_empresa !== "number" || !Number.isInteger(id_empresa)) {
      throw new Error("Error al recibir la ID de la empresa del nuevo usuario");
    }
    //Validar apellido como string - Elimina posible espacios al inicio y al final - que no sea vacío o null
    if (!id_rol || typeof id_rol !== "number" || !Number.isInteger(id_rol)) {
      throw new Error("Error al recibir el ID del rol del nuevo usuario");
    }
    //Validar rut como string - Elimina posible espacios al inicio y al final
    if (!rut || typeof rut !== "string" || rut.trim() === "") {
      throw new Error("Error al recibir el rut del nuevo usuario");
    }
    //Validar dv como string - Elimina posible espacios al inicio y al final - que no sea vacío o null
    if (!dv || typeof dv !== "string" || dv.trim() === "") {
      throw new Error("Error al recibir el dígito verificador del nuevo usuario");
    }
    //Validar nombre como string - Elimina posible espacios al inicio y al final - que no sea vacío o null
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      throw new Error("Error al recibir el nombre del nuevo usuario");
    }
    //Validar apellido como string - Elimina posible espacios al inicio y al final - que no sea vacío o null
    if (!ap_paterno || typeof ap_paterno !== "string" || ap_paterno.trim() === "") {
      throw new Error("Error al recibir el apellido paterno del nuevo usuario");
    }
    //Validar apellido como string - Elimina posible espacios al inicio y al final - que no sea vacío o null
    if (!ap_materno || typeof ap_materno !== "string" || ap_materno.trim() === "") {
      throw new Error("Error al recibir el apellido materno del nuevo usuario");
    }
    //Validar contraseña como string - Elimina posible espacios al inicio y al final - que no sea vacío o null
    if (!contrasena || typeof contrasena !== "string" || contrasena.trim() === "") {
      throw new Error("Error al recibir el rut del nuevo usuario");
    }
    // Validación de la contraseña con los caracteres de seguridad
    const validatedPass = await validatePassword(contrasena);
    if (!validatedPass) {
      throw new Error("La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (+/@$#|!¡%*¿?&.-_)");
    }


    // Obtiene el nombre de la empresa a partir del id_empresa
    const empresaQuery = 'SELECT nombre FROM sac.empresa WHERE id = $1';
    const { rows: empresaRows } = await pool.query(empresaQuery, [id_empresa]);
    if (empresaRows.length === 0) {
      return res.status(400).send({
        success: false,
        message: 'La empresa ingresada no existe',
      });
    }

    const nombre_empresa = empresaRows[0].nombre;


    // Verifica si el correo ya existe en la tabla de usuario
    const correoQuery = 'SELECT COUNT(*) AS count FROM sac.usuario WHERE correo = $1';
    const { rows: correoRows } = await pool.query(correoQuery, [correo]);
    const countCorreo = correoRows[0].count;
    if (countCorreo > 0) {
      return res.status(400).send({
        success: false,
        message: 'El correo ingresado ya existe',
      });
    }

    // Verifica si el rut ya existe en la tabla de usuario
    const rutQuery = 'SELECT COUNT(*) AS count FROM sac.usuario WHERE rut = $1';
    const { rows: rutRows } = await pool.query(rutQuery, [rut]);
    const countRut = rutRows[0].count;
    if (countRut > 0) {
      return res.status(400).send({
        success: false,
        message: 'El rut ya está registrado',
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
      and u.id != $2
      and u.id_rol = 3;`;

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

//get user por id

exports.getUserPorId = async (req, res) => {
  try {
    const userId = req.params.id; //  

    const query = "SELECT * FROM sac.usuario WHERE id = $1"; // 
    const values = [userId]; // Establece el valor del id en la consulta preparada

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      // Si no se encuentra ningún usuario con el id proporcionado, devuelve un mensaje adecuado
      return res.status(404).send({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    console.log("BD DATA: ", result.rows);

    return res.status(200).send({
      success: true,
      message: "Usuario encontrado",
      Data: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener el usuario", error);
    res.status(500).send("Error en el servidor");
  }
};



//update user


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario de la ruta
    const { id_rol, rut, dv, nombre, ap_paterno, ap_materno, correo } = req.body;

    const query = `
      UPDATE sac.usuario
      SET
        id_rol = $1,
        rut = $2,
        dv = $3,
        nombre = $4,
        ap_paterno = $5,
        ap_materno = $6,
        correo = $7,
        created_at = NOW() -- Establecer la fecha actual
      WHERE
        id = $8
    `;

    const values = [id_rol, rut, dv, nombre, ap_paterno, ap_materno, correo, id];

    await pool.query(query, values);

    return res.status(200).send({
      success: true,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar el usuario", error);
    res.status(500).send("Error en el servidor");
  }
};

//desactivar usuario

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario de la ruta
    const { id_estado } = req.body; // Obtener el nuevo estado del usuario

    const query = `
      UPDATE sac.usuario
      SET
        id_estado = $1
      WHERE
        id = $2
    `;

    const values = [id_estado, id];

    await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: "Estado de usuario actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar el estado de usuario", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};


// Cambio de contraseña para usuarios. Incluye validaciones para la nueva contraseña
exports.updatePasswordApp = async (req, res) => {
  try {
    const { contrasena_actual, nueva_contrasena } = req.body;
    const {id_usuario} = req.params;

    // Verificar si el usuario existe
    const usuarioQuery = 'SELECT * FROM sac.usuario WHERE id = $1';
    const { rows: usuarioRows } = await pool.query(usuarioQuery, [id_usuario]);
    if (usuarioRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'El usuario no existe',
      });
    }

    const usuario = usuarioRows[0];
    const contrasenaCoincide = await bcrypt.compare(contrasena_actual, usuario.contrasena);

    if (!contrasenaCoincide) {
      return res.status(400).send({
        success: false,
        message: 'La contraseña actual ingresada es incorrecta',
      });
    }

    // Validar la nueva contraseña
    if (typeof nueva_contrasena !== 'string' || nueva_contrasena.trim() === '') {
      throw new Error('Error al recibir la nueva contraseña');
    }

    // Validación de la nueva contraseña con los caracteres de seguridad
    const validatedPass = await validatePassword(nueva_contrasena);
    if (!validatedPass) {
      throw new Error('La nueva contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (+/@$#|!¡%*¿?&.-_)');
    }

    // Encriptación de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nueva_contrasena, 10);

    // Actualizar la contraseña en la base de datos
    const updatePassQuery = 'UPDATE sac.usuario SET contrasena = $1 WHERE id = $2';
    await pool.query(updatePassQuery, [hashedPassword, id_usuario]);

    return res.status(200).send({
      success: true,
      message: 'Contraseña actualizada con éxito',
    });
  } catch (error) {
    console.error('Error al actualizar contraseña', error);
    res.status(500).send('Error en el servidor');
  }
};

