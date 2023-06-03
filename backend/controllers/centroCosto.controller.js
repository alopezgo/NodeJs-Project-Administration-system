const { pool } = require('../db/db');


//Función para obtener todos los Centros de Costo de la Empresa del Usuario logueado
exports.getCentroCosto = async (req, res) => {
  try {
    const { id_empresa } = req.params;
    const query = `
                    SELECT id, id_empresa,id_turno, centro
                    FROM sac.centro_costos
                    WHERE id_empresa = $1;`;
    const result = await pool.query(query, [id_empresa]);

    return res.status(200).send({
      success: true,
      message: "centros encontrados",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener los centros de costos', error);
    res.status(500).send('Error en el servidor');
  }
};

// Función para obtener todas las empresas.
exports.getEmpresas = async (req, res) => {
  try {
    // Realizar la consulta SQL.
    const result = await pool.query('SELECT * FROM sac.empresa');

    // Enviar las empresas como respuesta.
    return res.status(200).send({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener empresas', error);
    res.status(500).send('Error en el servidor');
  }
};


//Función para obtener todos los Tipos de Consumo
exports.getTiposConsumo = async (req, res) => {
  try {
    const query = `
                    SELECT id as id_tipo_consumo, tipo as tipo_consumo
                    FROM sac.tipo_consumo`;
    const result = await pool.query(query);

    return res.status(200).send({
      success: true,
      message: "tipos consumo encontrados",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener los tipos de consumo', error);
    res.status(500).send('Error en el servidor');
  }
};

