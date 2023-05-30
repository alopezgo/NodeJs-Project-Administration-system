const express = require("express");
const app = require("./app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "&zC#TkZmAZ#9^H2^XGcw"; 
const PORT = 3000;

app.use(express.static("public"));

app.use((req, res, next) => {
  const excludedPaths = ["/", "/login"]; // Rutas excluidas de la verificación del token

  if (excludedPaths.includes(req.path)) {
    // La ruta está excluida, permite el acceso sin verificar el token
    next();
  } else {
    const token = req.headers.authorization;

    if (token) {
      try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
      } catch (error) {
        res.redirect("/login"); // Redirige a login.html en caso de token inválido
      }
    } else {
      res.redirect("/login"); // Redirige a login.html si no se proporciona un token
    }
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Ruta para login.html
app.get("/login", (req, res) => {
  res.sendFile(__dirname +"/public/login.html");
});

// Ruta para dashboard.html

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

// Ruta para agregar_usuario.html
app.get("/agregarUsuario", (req, res) => {
  res.sendFile(__dirname + "/public/agregar_usuario.html");
});

// Ruta para alimentacion.html
app.get("/alimentacion", (req, res) => {
  res.sendFile(__dirname + "/public/alimentacion.html");
});

// Ruta para asistencia.html
app.get("/asistencia", (req, res) => {
  res.sendFile(__dirname + "/public/asistencia.html");
});

// Ruta para editar_usuario.html
app.get("/modificarUsuario", (req, res) => {
  res.sendFile(__dirname + "/public/editar_usuario.html");
});

// Ruta para faq.html
app.get("/FAQ", (req, res) => {
  res.sendFile(__dirname + "/public/faq.html");
});

// Ruta para informes.html
app.get("/informes", (req, res) => {
  res.sendFile(__dirname + "/public/informes.html");
});

// Ruta para permisos.html
app.get("/permisos", (req, res) => {
  res.sendFile(__dirname + "/public/permisos.html");
});

// Ruta para usuarios.html
app.get("/usuarios", (req, res) => {
  res.sendFile(__dirname + "/public/usuarios.html");
});


app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`);
});


