const { pool } = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generator = require('password-generator');





// Función Actualizada. Al recibir un correo erroneo ya no se cae el servidor
async function loginWeb(correo, contrasena) {
    
    const query = `SELECT id, id_empresa, id_rol, nombre, ap_paterno, correo, contrasena 
                   FROM sac.usuario 
                   WHERE correo = $1 
                   AND id_estado = 1`;

    const { rows } = await pool.query(query, [correo]);

    if (rows.length === 0) {
        return {
            success: false,
            message: "El correo ingresado no se encuentra registrado",
            data: null,
        };
    }

    const isPasswordCorrect = await bcrypt.compare(
        contrasena,
        rows[0].contrasena
    );

    if (!isPasswordCorrect) {
        return {
            success: false,
            message: "La contraseña ingresada es incorrecta",
            data: null,
        };
    }

    // Genera un token JWT para el usuario
    const token = jwt.sign({ userId: rows[0].id }, "tu_secreto_secreto", {
        expiresIn: "1h",
    });

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
             isError: true, // Agregar un indicador de error falso
         };
    }
    if (!isPasswordCorrect) {
        return {
            success: false,
            message: "La contraseña ingresada es incorrecta",
            data: null,
        };
    }

    return { success: true, message: "Login exitoso", token: token, data: rows };
};


// Función Login para APP
async function loginApp(correo, contrasena) {
    
    const query = `SELECT id, id_empresa, id_rol, nombre, ap_paterno, correo, contrasena 
                   FROM sac.usuario 
                   WHERE correo = $1 
                   AND id_estado = 1`;

    const { rows } = await pool.query(query, [correo]);

    if (rows.length === 0) {
        return {
            success: false,
            message: "El correo ingresado no se encuentra registrado",
            data: null,
        };
    }

    const isPasswordCorrect = await bcrypt.compare(
        contrasena,
        rows[0].contrasena
    );

    if (!isPasswordCorrect) {
        return {
            success: false,
            message: "La contraseña ingresada es incorrecta",
            data: null,
        };
    }

    // Genera un token JWT para el usuario
    const token = jwt.sign({ userId: rows[0].id }, "tu_secreto_secreto", {
        expiresIn: "1h",
    });

    console.log(token);

    if (rows.length === 0) {
        return {
            success: false,
            message: "El correo ingresado no se encuentra registrado",
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

    return { success: true, message: "Login exitoso", token: token, data: rows };
};



async function existMail(mail) {
    const query = `SELECT id, id_empresa, id_rol, nombre, correo, contrasena 
                   FROM sac.usuario 
                   WHERE correo = $1 
                   AND id_estado = 1`;

    const { rows } = await pool.query(query, [mail]);

    if (rows.length === 0) {
        return {
            success: false,
            message: "El correo ingresado no se encuentra registrado",
            data: null,
        };
    } else {
        return {
            success: true,
            message: "El correo ingresado se encuentra registrado",
            data: rows[0],
        };
    }
}


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

// Validación de la contraseña, al menos una mayúscula, una minúscula, un número y un caracter especial
async function validatePassword(contrasena) {
    console.log('**pass vlaidation**', contrasena)
    const hasUpperCase = /[A-Z]/.test(contrasena);
    const hasLowerCase = /[a-z]/.test(contrasena);
    const hasNumber = /\d/.test(contrasena);
    const hasSpecialChar = /[+/@$#|!¡%*¿?&.-_]/.test(contrasena);

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

async function generatePassword() {
    const password = generator(8, false, /[\w\d\?\-@#$%&]/);
    return password;
}


module.exports = {
    loginWeb,
    loginApp,
    deleteUser,
    validatePassword,
    generatePassword,
    existMail
}


