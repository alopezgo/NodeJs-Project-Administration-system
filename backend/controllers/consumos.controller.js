const { pool } = require('../db/db');

exports.getDetalleConsumo= async (req, res) => {
    try {
        const query = `
                    SELECT  
                        e.nombre||' '||e.apellido_paterno||' '||e.apellido_materno as nom_empleado,
                        e.rut||'-'||e.dv as rut_empleado,
                        p.nombre as nom_empresa,
                        cc.centro as centro_costos,
                        tc.tipo as tipo_consumo,
                        dc.id_tipo_consumo,
                        dc.dt_consumo,
                        '$'||dc.precio::int as precio
                    FROM sac.empleado AS e
                    JOIN    sac.empresa AS p on e.id_empresa = p.id
                    JOIN    sac.centro_costos AS cc on e.id = cc.id_empresa
                    JOIN    sac.detalle_consumo AS dc on dc.id_empleado = e.id
                    JOIN    sac.tipo_consumo AS tc on tc.id = dc.id_tipo_consumo`;
    const result = await pool.query(query);

    console.log("BD DATA: ", result.rows)

    return res.status(200).send({
      success: true,
      message: "Detalle Consumo encontrado",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener Detalle Consumo', error);
    res.status(500).send('Error en el servidor');
  }
};

//agregar registro a DETALLE_CONSUMO 

exports.addConsumo = async (req, res) => {
  try {
    const { rut_empleado, consumo } = req.body;
    if (!rut_empleado || !consumo) {
      return res.status(400).send({ success: false, message: "Se requiere el rut del empleado y los datos del consumo" });
    }

    // Busca el id del empleado a partir del rut
    const query = 'SELECT id FROM sac.empleado WHERE rut = $1';
    const { rows } = await pool.query(query, [rut_empleado]);
    const id_empleado = rows[0].id;
    
    // Inserta el registro en detalle_consumo
    const insertQuery = 'INSERT INTO sac.detalle_consumo (id_empleado, id_tipo_consumo, dt_consumo) VALUES ($1, $2, NOW())';
    await pool.query(insertQuery, [id_empleado, consumo.id_tipo_consumo]);

    return res.status(200).send({
      success: true,
      message: 'Consumo registrado con éxito',
    });
  } catch (error) {
    console.error('Error al insertar consumo', error);
    res.status(500).send('Error en el servidor');
  }
};

//mostrar consumo por id empresa

exports.getConsumosPorEmpresa = async (req, res) => {
  try {
    const { id_empresa } = req.params;

    // Ejecutar la consulta
    const query = `
      SELECT 
        e.nombre || ' ' || e.apellido_paterno || ' ' || e.apellido_materno as nom_empleado,
        tc.tipo as tipo_consumo,
        dc.dt_consumo,
        '$' || tc.precio::int as precio
      FROM sac.detalle_consumo as dc
      JOIN sac.empleado as e ON dc.id_empleado = e.id
      JOIN sac.tipo_consumo as tc ON dc.id_tipo_consumo = tc.id
      JOIN sac.empresa as p ON e.id_empresa = p.id
      WHERE p.id = $1;
    `;
    const { rows } = await pool.query(query, [id_empresa]);

    // Devolver los resultados en formato JSON
    return res.status(200).json({
      success: true,
      message: 'Consumos obtenidos con éxito',
      data: rows,
    });
  } catch (error) {
    console.error('Error al obtener los consumos', error);
    return res.status(500).send('Error en el servidor');
  }
};

exports.getConsumosPorFecha = async (req, res) => {

};