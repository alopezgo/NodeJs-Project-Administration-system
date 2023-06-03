const { pool } = require('../db/db');

//Función para obtener Empleados por empresa
exports.getEmpleadosPorEmpresa = async (req, res) => {
    try {
      const { id_empresa } = req.params;
      const query = `
                      SELECT 
                      id as id_empleado,
                      concat(nombre,' ', apellido_paterno, ' ',apellido_materno) as nom_empleado
                      FROM sac.empleado
                      where id_empresa = $1`;
      
      const result = await pool.query(query,[id_empresa]);
  
      return res.status(200).send({
        success: true,
        message: "Empleados por empresa encontrados",
        Data: result.rows,
      });
    } catch (error) {
      console.error("Error al obtener empleados por empresa", error);
      res.status(500).send("Error en el servidor");
    }
  };