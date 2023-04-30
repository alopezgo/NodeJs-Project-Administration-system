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
          JOIN sac.evento_permiso AS ep ON dp.id_evento_permiso = ep.id
          JOIN sac.empleado AS e ON e.id = dp.id_empleado
          JOIN sac.empresa AS p ON p.id = e.id_empresa
          JOIN sac.centro_costos AS cc ON e.id = cc.id_empresa
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
  