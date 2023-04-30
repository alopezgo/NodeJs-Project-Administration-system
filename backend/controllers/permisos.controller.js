const { pool } = require('../db/db');

exports.getDetallePermiso = async (req, res) => {
    try {
        const query = `
            SELECT
                    e.nombre || ' ' || e.apellido_paterno || ' ' || e.apellido_materno AS nom_empleado,
                    e.rut || '-' || e.dv AS rut_empleado,
                    p.nombre AS nom_empresa,
                    cc.centro AS centro_costos,
                    ep.id AS id_permiso,
                    ep.evento AS permiso,
                    unnest(fecha) AS fecha_permiso 
            FROM
                    sac.detalle_permiso AS dp
            JOIN    sac.evento_permiso AS ep ON dp.id_evento_permiso = ep.id
            JOIN    sac.empleado AS e ON e.id = dp.id_empleado
            JOIN    sac.empresa AS p ON p.id = e.id_empresa
            JOIN    sac.centro_costos AS cc ON e.id = cc.id_empresa
        `;

        const result = await pool.query(query);

        console.log("BD DATA:", result.rows);

        return res.status(200).send({
            success: true,
            message: "Permisos...",
            Data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener los permisos', error);
        res.status(500).send('Error en el servidor');
    }
};


exports.getAsistenciaPermiso = async (req, res) => {
    try {
        const query = `
            WITH permisos AS (
                SELECT  dp.id_empleado,
                        ep.evento AS desc_evento,
                        unnest(dp.fecha) AS fecha
                FROM    sac.detalle_permiso dp
                JOIN    sac.evento_permiso ep ON dp.id_evento_permiso = ep.id
                ), ingresos_egresos AS (
                SELECT  da.id_empleado,
                        ea.evento,
                        date(da.dt_evento) AS fecha
                FROM    sac.detalle_asistencia da
                JOIN    sac.evento_asistencia ea ON da.id_evento_asistencia = ea.id
            ),
            integracion as (
                SELECT  ingresos_egresos.id_empleado,
                        ingresos_egresos.evento,
                        ingresos_egresos.fecha
                FROM    ingresos_egresos
                UNION ALL
                SELECT  permisos.id_empleado,
                        permisos.desc_evento AS evento,
                        permisos.fecha
                FROM    permisos
            )
       
                SELECT 
                        e.nombre|| ' '||e.apellido_paterno||' '||e.apellido_materno AS nom_empleado,
                        e.rut||'-'||e.dv AS rut_empleado,
                        p.nombre AS nom_empresa,
                        cc.centro AS centro_costos,
                        i.evento,
                        i.fecha
                FROM    integracion as i
                JOIN    sac.empleado as e on i.id_empleado = e.id
                JOIN    sac.empresa p ON p.id = e.id_empresa
                JOIN    sac.centro_costos cc ON e.id = cc.id_empresa
        `;

        const result = await pool.query(query);

        console.log("BD DATA:", result.rows);

        return res.status(200).send({
            success: true,
            message: "Permisos...",
            Data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener los permisos', error);
        res.status(500).send('Error en el servidor');
    }
};