const { pool } = require('../db/db');



//Todo TEST

exports.getDetalleConsumo = async (req, res) => {
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
                        '$'||tc.precio as precio
                    FROM sac.empleado AS e
                    JOIN    sac.empresa AS p on e.id_empresa = p.id
                    JOIN    sac.centro_costos AS cc on e.id_centro_costos = cc.id
                    JOIN    sac.detalle_consumo AS dc on dc.id_empleado = e.id
                    JOIN    sac.tipo_consumo AS tc on tc.id = dc.id_tipo_consumo`;
    const result = await pool.query(query);

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

//Agrega registro consumo a BBDD DETALLE_CONSUMO 
//Actualizado con nuevas validaciones
exports.addConsumo = async (req, res) => {
  try {
    console.log('body', req.body)
    const { rut_empleado, consumo } = req.body;
    if (!rut_empleado || !consumo) {
      return res.status(400).send({ success: false, message: "Se requiere el rut del empleado y los datos del consumo" });
    }

    if (typeof rut_empleado !== "string" || rut_empleado.trim() === "") {
      throw new Error("Error al recibir el rut del empleado");
    }
    if (typeof consumo.id_tipo_consumo !== "number" || isNaN(consumo.id_tipo_consumo)) {
      throw new Error("Error: al recibir el ID del consumo");
    }

    // Busca el id del empleado a partir del rut
    const consumoQuery = 'SELECT * FROM sac.tipo_consumo WHERE id = $1';
    const { rowCount } = await pool.query(consumoQuery, [consumo.id_tipo_consumo]);
    if (rowCount === 0) {
      return res.status(400).send({ success: false, message: "No existe el consumo que intenta registrar" });
    }

    // Busca el id del empleado a partir del rut
    const query = 'SELECT id FROM sac.empleado WHERE rut = $1';
    const { rows } = await pool.query(query, [rut_empleado]);

    if (rows.length > 0) {
      const id_empleado = rows[0].id;

      // Inserta el registro en detalle_consumo
      const insertQuery = 'INSERT INTO sac.detalle_consumo (id_empleado, id_tipo_consumo, dt_consumo) VALUES ($1, $2, NOW())';
      await pool.query(insertQuery, [id_empleado, consumo.id_tipo_consumo]);

      return res.status(200).send({
        success: true,
        message: 'Consumo registrado con éxito',
      });
    } else {
      return res.status(400).send({ success: false, message: "No se encontró el empleado con el rut proporcionado" });
    }
  } catch (error) {
    console.error('Error al insertar consumo', error);
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

////GET consumos por id empresa CON PARAMETROS OPCIONALES
exports.getConsumosPorEmpresa = async (req, res) => {
  try {
    const centro = req.query.centro;
    const consumo = req.query.consumo;
    const desde = req.query.desde;
    const hasta = req.query.hasta;
    const { id_empresa } = req.params;

    // Ejecutar la consulta
    let query = `
      SELECT 
        cc.centro as centro_costos,
        concat(e.nombre,' ', e.apellido_paterno,' ',e.apellido_materno) as nom_empleado,
        concat(e.rut,'-', e.dv) as rut,
        tc.tipo as tipo_consumo,
        to_char(dc.dt_consumo, 'YYYY-MM-DD') as fecha,
        to_char(dc.dt_consumo, 'HH24:MI:SS') as hora,
        '$' || tc.precio as precio
      FROM sac.detalle_consumo as dc
      JOIN sac.empleado as e ON dc.id_empleado = e.id
      JOIN sac.tipo_consumo as tc ON dc.id_tipo_consumo = tc.id
      JOIN sac.empresa as p ON e.id_empresa = p.id
      JOIN sac.centro_costos as cc ON e.id_centro_costos= cc.id
      WHERE p.id = $1`;

    const params = [id_empresa];

    if (centro !== undefined) {
      query += ` AND e.id_centro_costos = $${params.length + 1}`;
      params.push(centro);
    }

    if (consumo !== undefined) {
      query += ` AND tc.id = $${params.length + 1}`;
      params.push(consumo);
    }

    if (desde !== undefined && hasta !== undefined) {
      query += ` AND date(dc.dt_consumo) between $${params.length + 1
        } AND $${params.length + 2}`;
      params.push(desde);
      params.push(hasta);
    }

    const { rows } = await pool.query(query, params);

    // Devolver los resultados en formato JSON
    return res.status(200).json({
      success: true,
      message: "Consumos por CC obtenidos con éxito",
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener los consumos", error);
    return res.status(500).send("Error en el servidor");
  }
};

exports.getConsumosPorCCFecha = async (req, res) => {
  try {
    const { id_empresa } = req.params;
    const { id_cc } = req.params;
    const { fecha_desde } = req.params;
    const { fecha_hasta } = req.params;
    // Ejecutar la consulta
    const query = `
        SELECT 
        concat(e.nombre,' ', e.apellido_paterno,' ',e.apellido_materno) as nom_empleado,
		concat(e.rut,'-', e.dv) as rut,
        tc.tipo as tipo_consumo,
        to_char(dc.dt_consumo, 'YYYY-MM-DD') as fecha,
		to_char(dc.dt_consumo, 'HH24:MI:SS') as hora,
        '$' || tc.precio::int as precio
      FROM sac.detalle_consumo as dc
      JOIN sac.empleado as e ON dc.id_empleado = e.id
      JOIN sac.tipo_consumo as tc ON dc.id_tipo_consumo = tc.id
      JOIN sac.empresa as p ON e.id_empresa = p.id
	  WHERE p.id = $1
	  and e.id_centro_costos =$2
	  and date(dc.dt_consumo) between date($3) and date($4);
    `;
    const { rows } = await pool.query(query, [id_empresa, id_cc, fecha_desde, fecha_hasta]);

    // Devolver los resultados en formato JSON
    return res.status(200).json({
      success: true,
      message: "Consumos por CC obtenidos con éxito",
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener los consumos", error);
    return res.status(500).send("Error en el servidor");
  }
};



//PUEDE SER ÚTIL PARA LOS INFORMES 
//GET consumos por id empresa y Fecha

exports.getConsumosPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body;
    const { id_empresa } = req.params;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).send({ success: false, message: "Debe indicar una fecha de inicio y término." });
    };

    const empresaQuery = `SELECT id FROM sac.empresa WHERE id = $1`;
    const empresaResult = await pool.query(empresaQuery, [id_empresa]);
    if (empresaResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'La empresa no existe' });
    }

    const query = `
      SELECT  emp.nombre AS empresa_nombre,
              e.nombre AS empleado_nombre,
              tc.tipo AS tipo_consumo, 
              tc.precio, 
              dc.dt_consumo
      FROM    sac.detalle_consumo AS dc
      INNER JOIN  sac.tipo_consumo AS tc ON dc.id_tipo_consumo = tc.id
      INNER JOIN  sac.empleado AS e ON dc.id_empleado = e.id
      INNER JOIN  sac.empresa AS emp ON e.id_empresa = emp.id
      WHERE   emp.id = $1
      AND     dc.dt_consumo >= $2 AND dc.dt_consumo <= $3
    `;
    const values = [id_empresa, fechaInicio, fechaFin];
    const result = await pool.query(query, values);
    const consumos = result.rows;

    // Generar el resumen de consumo
    const resumenConsumo = {
      empresa: consumos.length > 0 ? consumos[0].empresa_nombre : '',
      periodo: `${fechaInicio} al ${fechaFin}`,
      consumos: []
    };

    // Agrupar los consumos por tipo y calcular el total de consumos y el costo total en el periodo
    const consumosPorTipo = consumos.reduce((agrupado, consumo) => {
      if (!agrupado[consumo.tipo_consumo]) {
        agrupado[consumo.tipo_consumo] = {
          tipo: consumo.tipo_consumo,
          totalConsumos: 0,
          costoTotal: 0
        };
      }
      agrupado[consumo.tipo_consumo].totalConsumos += 1;
      agrupado[consumo.tipo_consumo].costoTotal += consumo.precio;
      return agrupado;
    }, {});

    // Agregar los consumos al resumen
    for (const tipo in consumosPorTipo) {
      resumenConsumo.consumos.push(consumosPorTipo[tipo]);
    }

    // Devuelve el resumen de consumo como respuesta
    return res.status(200).json({ success: true, informeConsumo: resumenConsumo });
  } catch (error) {
    console.error('Error al obtener los consumos:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener los consumos' });
  }
};


//GET consumos por id empresa, Fecha y Centro Costo
exports.getConsumosCentroCosto = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, centroCosto } = req.body;
    const { id_empresa } = req.params;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).send({ success: false, message: "Debe indicar una fecha de inicio y término." });
    };

    const empresaQuery = `SELECT id FROM sac.empresa WHERE id = $1`;
    const empresaResult = await pool.query(empresaQuery, [id_empresa]);
    if (empresaResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'La empresa no existe' });
    }

    const query = `
        SELECT  emp.nombre AS empresa_nombre,
                cc.centro AS centro_costo_nombre,
                e.nombre AS empleado_nombre,
                tc.tipo AS tipo_consumo, 
                tc.precio, 
                dc.dt_consumo
        FROM    sac.detalle_consumo AS dc
        INNER JOIN  sac.tipo_consumo AS tc ON dc.id_tipo_consumo = tc.id
        INNER JOIN  sac.empleado AS e ON dc.id_empleado = e.id
        INNER JOIN  sac.empresa AS emp ON e.id_empresa = emp.id
        INNER JOIN  sac.centro_costos AS cc ON e.id_centro_costos = cc.id
        WHERE   emp.id = $1
        AND     cc.centro = $2
        AND     dc.dt_consumo >= $3 AND dc.dt_consumo <= $4
      `;
    const values = [id_empresa, centroCosto, fechaInicio, fechaFin];
    const result = await pool.query(query, values);
    const consumos = result.rows;

    // Generar el resumen de consumo
    const resumenConsumo = {
      empresa: consumos.length > 0 ? consumos[0].empresa_nombre : '',
      centroCosto: consumos.length > 0 ? consumos[0].centro_costo_nombre : '',
      periodo: `${fechaInicio} al ${fechaFin}`,
      consumos: []
    };

    // Agrupar los consumos por tipo y calcular el total de consumos y el costo total en el periodo
    const consumosPorTipo = consumos.reduce((agrupado, consumo) => {
      if (!agrupado[consumo.tipo_consumo]) {
        agrupado[consumo.tipo_consumo] = {
          tipo: consumo.tipo_consumo,
          totalConsumos: 0,
          costoTotal: 0
        };
      }
      agrupado[consumo.tipo_consumo].totalConsumos += 1;
      agrupado[consumo.tipo_consumo].costoTotal += consumo.precio;
      return agrupado;
    }, {});

    // Agregar los consumos al resumen
    for (const tipo in consumosPorTipo) {
      resumenConsumo.consumos.push(consumosPorTipo[tipo]);
    }

    // Devuelve el resumen de consumo como respuesta
    return res.status(200).json({ success: true, informeConsumo: resumenConsumo });
  } catch (error) {
    console.error('Error al obtener los consumos:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener los consumos' });
  }
};


// Servicio para obtener total consumo mensual
exports.getInformeConsumoMensual = async (req, res) => {
  try {
    const { id_empresa } = req.params;

    const query = `
    Select  cont.nombre as nom_contratista, 
    count(distinct empl.id) as cant_empleados,
    empl.id_centro_costos,
    extract(YEAR from cons.dt_consumo) as año,
	extract(MONTH from cons.dt_consumo) as mes,
    count(cons.dt_consumo) as cant_consumos,
    tipo.tipo,
    sum(tipo.precio) as total
    from sac.contratista as cont
    join sac.empresa as emp
    on cont.id_empresa = emp.id
    join sac.empleado as empl 
    on cont.id_empresa = empl.id_empresa
    and empl.id = empl.id_empresa 
    join sac.detalle_consumo as cons
    on cons.id_empleado = empl.id
    join sac.tipo_consumo as tipo on cons.id_tipo_consumo = tipo.id
    where cont.id_servicio = 1
    and cont.id_empresa = $1
    GROUP BY cont.nombre, emp.nombre, empl.id, empl.id_centro_costos, tipo.tipo, año, mes
      `;
    const params = [id_empresa];
    const { rows } = await pool.query(query, params);

    // Devuelve el resumen de consumo como respuesta
    return res.status(200).json({
      success: true,
      message: "Informe consumo mensual obtenido con éxito",
      data: rows,
    });
  } catch (error) {
    console.error('Error al obtener informe consumo mensual:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener Informe consumo mensual' });
  }
};
