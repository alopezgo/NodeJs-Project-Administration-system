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

exports.getPermisoPorEmpresa = async (req, res) => {
  try {
    const { id_empresa } = req.params;

    // Ejecutar la consulta
    const query = `
      With base as  (SELECT dp.id, CONCAT(e.nombre, ' ',e.apellido_paterno,' ', e.apellido_materno) AS empleado,
       e.rut||'-'||e.dv AS rut,
       ep.evento AS tipo,
       unnest(dp.fecha) as fecha
       FROM sac.detalle_permiso dp JOIN sac.empleado e ON e.id = dp.id_empleado
	   JOIN sac.evento_permiso ep ON dp.id_evento_permiso = ep.id
	   Where e.id_empresa = $1)
	   
	   SELECT id, empleado, rut, tipo, 
	   to_char(min(fecha), 'YYYY-MM-DD') as desde, 
	   to_char(max(fecha), 'YYYY-MM-DD') as hasta 
	   FROM base
	   GROUP BY id, empleado, rut, tipo;
    `;
    const { rows } = await pool.query(query, [id_empresa]);

    // Devolver los resultados en formato JSON
    return res.status(200).json({
      success: true,
      message: "Permisos por Empresa obtenidos con éxito",
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener Permisos por Empresa", error);
    return res.status(500).send("Error en el servidor");
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

// ADD REGISTRO EN TABLA DETALLE_PERMISO
exports.postRegistroPermiso = async (req, res) => {
  try {
    const { id_empleado, id_evento_permiso, fecha_desde, fecha_hasta } =
      req.body;

    // se crea array de fechas con constantes fecha_desde y fecha_hast
    const arrayFechas = [];
    const fechaInicio = new Date(fecha_desde);
    const fechaFin = new Date(fecha_hasta);

    // Agregar la fecha inicial al array
    arrayFechas.push(fechaInicio.toISOString().split("T")[0]);

    // Generar las fechas intermedias
    while (fechaInicio < fechaFin) {
      fechaInicio.setDate(fechaInicio.getDate() + 1);
      arrayFechas.push(fechaInicio.toISOString().split("T")[0]);
      }
      

    //establece el estado y la fecha actual
    const insertQuery =
      "INSERT INTO sac.detalle_permiso VALUES (DEFAULT, $1, $2, $3::date[])";
    const fechas = [arrayFechas];
    await pool.query(insertQuery, [id_empleado, id_evento_permiso, fechas]);

    return res.status(200).send({
      success: true,
      message: "Permiso insertado con éxito en Tabla",
    });
  } catch (error) {
    console.error("Error al insertar Permiso en Tabla", error);
    res.status(500).send("Error en el servidor");
  }
};

//Función para obtener todos los Tipos de Permiso
exports.getTiposPermiso = async (req, res) => {
  try {
    const query = `
                    SELECT id as id_tipo_permiso, evento as tipo_permiso
                    FROM sac.evento_permiso`;
    const result = await pool.query(query);

    return res.status(200).send({
      success: true,
      message: "tipos de permiso encontrados",
      Data: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener los tipos de permisos", error);
    res.status(500).send("Error en el servidor");
  }
};