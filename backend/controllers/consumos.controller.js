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