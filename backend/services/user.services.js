const { pool } = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


async function  login(correo, contraseña) {
    const query = `SELECT  id, id_empresa, id_rol, nombre, correo, contrasena 
                     FROM   sac.usuario 
                     WHERE  correo = $1 
                     AND id_estado = 1`;

    const { rows } = await pool.query(query, [correo]);
    const isPasswordCorrect = await bcrypt.compare(
        contraseña,
        rows[0].contrasena
    );
    // Genera un token JWT para el usuario
    const token = jwt.sign(
        { userId: rows[0].id },
        "tu_secreto_secreto",
        {
            expiresIn: "1h",
        }
    );
    console.log(token);

    if (rows.length === 0) {
        return {
            success: false,
            message: "El correo ingresado no se encuentra registrado",
            data: null,
        };
    }
    if (rows[0].id_rol == 3) {
        return {
            success: false,
            message: "No cuenta con los permisos necesarios para ingresar al sitio web",
            data: null,
        };
    }
    if (!isPasswordCorrect) {
        return {
            success: false,
            message: "La contraseña ingresada es incorrecta",
            data: null,
        };
    }

    return { success: true, message: "Login exitoso", token: token, data: rows};
};

async function deleteUser(correo) {
    const query = `
      UPDATE sac.usuario
      SET id_estado = 2
      WHERE correo = $1
    `;
  
    return new Promise((resolve, reject) => {
      pool.query(query, [correo], (err, result) => {
        if (err) {
          console.error('Error al cambiar el estado del usuario', err);
          return reject(err);
        }
        console.log(`El usuario ${correo} ha sido eliminado`);
        resolve({ success: true });
      });
    });
  }


    module.exports = {
        login,
        deleteUser,
    }


