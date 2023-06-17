const path = require('path');

exports.downloadData = async (req, res) => {
  try {
    const { dataFile } = req.body;

    if (dataFile === 'sacApk') {
      const fileName = 'sacApk';
      const filePath = path.join(__dirname, `../uploads/apk/${fileName}.apk`).replace(/\\/g, '/');
      return res.download(filePath, (error) => {
        console.log('filepath', filePath);
        if (error) {
          console.error('Error al descargar el archivo', error);
          res.status(500).send('Error en el servidor');
        }
      });
    } else if (dataFile === 'sacManual') {
      const fileName = 'sacManual';
      const filePath = path.join(__dirname, `../uploads/manual/${fileName}.pdf`).replace(/\\/g, '/');
      return res.download(filePath, (error) => {
        console.log('filepath', filePath);
        if (error) {
          console.error('Error al descargar el archivo', error);
          res.status(500).send('Error en el servidor');
        }
      });
    } else {
      res.status(400).send('Archivo no válido');
    }
  } catch (error) {
    console.error('Error al obtener Detalle Asistencia', error);
    res.status(500).send('Error en el servidor');
  }
};
