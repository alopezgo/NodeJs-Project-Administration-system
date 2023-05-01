const { pool } = require('../db/db');

exports.getDetalleAsistencia= async (req, res) => {
    try {
        const query = `
                    SELECT e.nombre||' '||e.apellido_paterno||' '||e.apellido_materno AS nom_empleado,
                        e.rut||'-'||e.dv AS rut_empleado,
                        p.nombre AS nom_empresa,
                        cc.centro AS centro_costos,
                        ea.id AS id_evento,
                        ea.evento AS tipo_evento,
                        da.dt_evento
                    FROM sac.detalle_asistencia da
                        JOIN sac.empleado e ON e.id = da.id_empleado
                        JOIN sac.evento_asistencia ea ON da.id_evento_asistencia = ea.id
                        JOIN sac.empresa p ON p.id = e.id_empresa
                        JOIN sac.centro_costos cc ON e.id = cc.id_empresa;`;
    const result = await pool.query(query);

    console.log("BD DATA: ", result.rows)

    return res.status(200).send({
      success: true,
      message: "Detalle Asistencia encontrado",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener Detalle Asistencia', error);
    res.status(500).send('Error en el servidor');
  }
};