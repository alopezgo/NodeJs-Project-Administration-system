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

exports.getAsistenciaPorEmpresa = async (req, res) => {
  try {
    const { id_empresa } = req.params;
    const centro = req.query.centro;
    const evento = req.query.evento;
    const desde = req.query.desde;
    const hasta = req.query.hasta;

    // Ejecutar la consulta
    let query = `
      SELECT
       cc.centro as centro_costos, 
       CONCAT(e.nombre, ' ',e.apellido_paterno,' ', e.apellido_materno) AS empleado,
       e.rut||'-'||e.dv AS rut,
       ea.evento AS tipo,
       to_char(da.dt_evento, 'YYYY-MM-DD') as fecha,
	     to_char(da.dt_evento, 'HH24:MI:SS') as hora
       FROM sac.detalle_asistencia da 
       JOIN sac.empleado e ON e.id = da.id_empleado
	     JOIN sac.evento_asistencia ea ON da.id_evento_asistencia = ea.id
       JOIN sac.empresa as p ON e.id_empresa = p.id
       JOIN sac.centro_costos as cc ON e.id_centro_costos= cc.id
	     Where e.id_empresa = $1`;
    const params = [id_empresa];

    if (centro !== undefined) {
      query += ` AND e.id_centro_costos = $${params.length + 1}`;
      params.push(centro);
    }
    if (evento !== undefined) {
      query += ` AND ea.id = $${params.length + 1}`;
      params.push(evento);
    }
    if (desde !== undefined && hasta !== undefined) {
      query += ` AND date(da.dt_evento) between $${params.length + 1} AND $${
        params.length + 2
      }`;
      params.push(desde);
      params.push(hasta);
    }
    const { rows } = await pool.query(query, params);

    // Devolver los resultados en formato JSON
    return res.status(200).json({
      success: true,
      message: "Asistencias por Empresa obtenidos con éxito",
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener Asistencias por Empresa", error);
    return res.status(500).send("Error en el servidor") ;
  }
};

//Función para obtener todos los Tipos de Asistencia
exports.getTiposAsistencia= async (req, res) => {
  try {
    const query = `
                    SELECT id as id_tipo_asistencia, evento as tipo_asistencia
                    FROM sac.evento_asistencia`;
    const result = await pool.query(query);

    return res.status(200).send({
      success: true,
      message: "tipos de asistencia encontrados",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener los tipos de asistencia', error);
    res.status(500).send('Error en el servidor');
  }
};

//Agrega registro consumo a BBDD DETALLE_CONSUMO 
//Actualizado con nuevas validaciones
exports.addAsistencia = async (req, res) => {
  try {
    console.log('body', req.body)
    const { rut_empleado, id_tipo_asistencia } = req.body;
    if (!rut_empleado || !id_tipo_asistencia) {
      return res.status(400).send({ success: false, message: "Se requiere el rut del empleado y los datos de asistencia" });
    }

    if (typeof rut_empleado !== "string" || rut_empleado.trim() === "") {
      throw new Error("Error al recibir el rut del empleado");
    }

    // Busca el id del empleado a partir del rut
    const eventoQuery = 'SELECT id FROM sac.evento_asistencia WHERE id = $1';
    const { rowCount } = await pool.query(eventoQuery, [id_tipo_asistencia]);
    if (rowCount === 0) {
      return res.status(400).send({ success: false, message: "No existe el evento asistencia que intenta registrar" });
    }

    // Busca el id del empleado a partir del rut
    const query = 'SELECT id FROM sac.empleado WHERE rut = $1';
    const { rows } = await pool.query(query, [rut_empleado]);

    if (rows.length > 0) {
      const id_empleado = rows[0].id;

      // Inserta el registro en detalle_consumo
      const insertQuery = 'INSERT INTO sac.detalle_asistencia (id, id_empleado, id_evento_asistencia, dt_evento) VALUES (DEFAULT, $1, $2, NOW())';
      await pool.query(insertQuery, [id_empleado, id_tipo_asistencia]);

      return res.status(200).send({
        success: true,
        message: 'Asistencia registrada con éxito',
      });
    } else {
      return res.status(400).send({ success: false, message: "No se encontró el empleado con el rut proporcionado" });
    }
  } catch (error) {
    console.error('Error al registrar la asistencia', error);
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

//TODO conectar a front en vista informes

exports.getInformeMensualAsisteConsume = async (req, res) =>{

  try{
    const { id_empresa } = req.params;
    const query = `
    WITH permisos AS (
      SELECT dp.id_empleado,
             ep.evento AS desc_evento,
             unnest(dp.fecha) AS fecha
      FROM sac.detalle_permiso dp
      JOIN sac.evento_permiso ep ON dp.id_evento_permiso = ep.id
    ),
    
    ingresos_egresos AS (
      SELECT  da.id_empleado,
          ea.evento,
          date(da.dt_evento) AS fecha
      FROM    sac.detalle_asistencia da
      JOIN    sac.evento_asistencia ea ON da.id_evento_asistencia = ea.id
      WHERE ea.id = 1 
      and date(da.dt_evento) between date_trunc('month', current_date) and current_date),
      
    full_asistencia as (
      SELECT permisos.id_empleado, permisos.desc_evento, permisos.fecha
      FROM permisos
      WHERE fecha between date_trunc('month', current_date) and current_date
      union all
      SELECT ie.id_empleado, ie.evento, ie.fecha
      FROM ingresos_egresos as ie),
      
    consumos as (
      SELECT dc.id_empleado,
          date(dc.dt_consumo) as fecha, 1 as consumo
      FROM sac.detalle_consumo dc where dc.id_tipo_consumo = 2 and date(dc.dt_consumo) between date_trunc('month', current_date) and current_date
    )
    
    Select to_char(f.fecha, 'YYYY-MM-DD') as dia_habil,
    concat(e.nombre,' ', e.apellido_paterno,' ',apellido_materno) as nom_empleado,
    concat(e.rut, '-', e.dv) as rut,
    coalesce(fa.desc_evento, 'Ausente') as asistencia,
    coalesce (c.consumo, 0) as almuerzo
    from sac.fechas as f
    cross join (select id, rut, dv,nombre, apellido_paterno, apellido_materno  from sac.empleado where id_empresa = $1) as e 
    left join full_asistencia as fa on fa.fecha = f.fecha
    and e.id = fa.id_empleado
    left join consumos as c on f.fecha = c.fecha and c.id_empleado = e.id
    where f.fecha between date_trunc('month', current_date) and current_date
    order by id, dia_habil;
    `
    const params = [id_empresa];
    const { rows } = await pool.query(query, params);

    // Devuelve el resumen de consumo como respuesta
    return res.status(200).json({
      success: true,
      message: "Informe Full mensual obtenido con éxito",
      data: rows,
    });

  }
  catch (error) {
    console.error('Error al obtener Informe Full mensual:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener Informe Full mensual' });
  }
}


//TODO conectar a front en vista informes

exports.getMetricas = async (req, res) =>{

  try{
    const { id_empresa } = req.params;
    const query = `
    WITH 
    permisos_raw AS (
      SELECT dp.id_empleado,
            dp.id_evento_permiso,
            unnest(dp.fecha) AS fecha
      FROM sac.detalle_permiso dp
    ),

    permisos as (
      SELECT 
        extract(year from pr.fecha) as annio,
        extract(month from pr.fecha) as mes,
        count(distinct pr.id_empleado) as count_emp,
        count(pr.fecha) as dias_permisos
      FROM permisos_raw as pr
      WHERE fecha between date_trunc('month', (current_date - interval '6 months')) and current_date
      group by annio, mes
    ),

    asistencias AS (
      SELECT  
          extract(year from da.dt_evento) as annio,
          extract(month from da.dt_evento) as mes,
          count(distinct da.id_empleado) as count_emp,
          count(da.dt_evento) AS dias_asiste
      FROM    sac.detalle_asistencia da
      WHERE da.id_evento_asistencia = 1 
      and date(da.dt_evento) between date_trunc('month', (current_date - interval '6 months')) and current_date
      group by annio, mes
    ),
      
    almuerzos as (
      SELECT 
          extract(year from dc.dt_consumo) as annio,
          extract(month from dc.dt_consumo) as mes,
          count(distinct dc.id_empleado) as count_emp,
          count(dc.dt_consumo) as dias_almuerza
      FROM sac.detalle_consumo dc where dc.id_tipo_consumo = 2 
        and date(dc.dt_consumo) between date_trunc('month', (current_date - interval '6 months')) and current_date
      group by annio, mes
    ),

    dias as (
        Select 
        extract(year from f.fecha) as annio,
        extract(month from f.fecha) as mes,
        count(f.fecha) as dias_mes
        from sac.fechas as f
        where f.fecha between date_trunc('month', (current_date - interval '6 months')) and current_date
        and extract (month from f.fecha) not in (1, 2)
        group by annio, mes)


    SELECT 
    c.annio, c.mes, d.dias_mes as q_dias_mes,
    (select count(id) from sac.empleado where id_empresa = $1) as q_emp_total,
    coalesce(a.count_emp,0) as q_emp_asiste,
    c.count_emp as q_emp_consume,
    coalesce(a.dias_asiste, 0) as asistencia_real, 
    c.dias_almuerza as almuerzos_real,
    coalesce(p.dias_permisos, 0) as permisos,
    ((select count(id) from sac.empleado where id_empresa = $1) * d.dias_mes) - coalesce(p.dias_permisos, 0)  as asistencia_esperada,
	coalesce(a.dias_asiste, 0) as almuerzos_esperado,
    ((coalesce(a.dias_asiste, 0)*100)/((select count(id) from sac.empleado) * d.dias_mes))::float as porc_obj_asist,
    coalesce(a.dias_asiste, 0) - c.dias_almuerza as delta_almuerzos
    from almuerzos as c 
    join dias as d on d.annio = c.annio and d.mes = c.mes
    left join asistencias as a on c.annio = a.annio and c.mes = a.mes
    left join permisos as p on p.annio = c.annio and p.mes = c.mes;
    `
    const params = [id_empresa];
    const { rows } = await pool.query(query, params);

    // Devuelve el resumen de consumo como respuesta
    return res.status(200).json({
      success: true,
      message: "Informe cumplimiento objetivo asistencia obtenido con éxito",
      data: rows,
    });

  }
  catch (error) {
    console.error('Error al obtener Informe cumplimiento objetivo asistencia:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener Informe cumplimiento objetivo asistencia' });
  }
}
