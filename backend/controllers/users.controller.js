const { pool } = require("../db/db");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.postCreatUser = async (req, res) => {
  try {
    //funcionalidades crear usuario

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

async function login(correo, contraseña) {
  const query = `SELECT  id, id_rol, correo, contrasena 
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

  return { success: true, message: "Login exitoso", token: token, data: rows };
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
    console.error("Error con la conexión a la base de datos", error);
    res.status(500).send(error);
  }
};

// const otrafuncion = async () => {
//   console.log(await login("test3@mail.com", "test3"));
// };
// otrafuncion();


exports.addUser = async (req, res) => {
  try {
    const { id_rol, correo, contrasena } = req.body;

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
