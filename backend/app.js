// index.js

// Archivo principal que configura Express y define el punto de entrada de la aplicación

const express = require('express');
const app = express();
const api = require('./routes/users.routes');

const port = 3000;

app.use(express.json());

app.use('/api', require('./routes'));

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API REST!');
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
