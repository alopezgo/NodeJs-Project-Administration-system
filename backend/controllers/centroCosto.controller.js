const { pool } = require('../db/db');

exports.getCentroCosto = async (req, res) => {
  try {
    const query = 'SELECT * FROM sac.centro_costos';
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