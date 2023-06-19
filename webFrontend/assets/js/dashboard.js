/* globals Chart:false, feather:false */


(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })
})()



document.addEventListener("DOMContentLoaded", function () {
  const tokenUsuario = localStorage.getItem("token");
  const isLoginPage = window.location.href.includes("login.html");

  if (!tokenUsuario && !isLoginPage) {
    window.location.href = "login.html";
  }
  const nombreUsuario = localStorage.getItem("nombre_usuario");

  if (nombreUsuario) {
    const nombreUsuarioElemento = document.getElementById("nombre-usuario");

    //const imagenElemento = document.getElementById("img-usuario");
    const nombreElemento = document.createElement("span");
    nombreElemento.innerHTML = "Hola " + nombreUsuario;

    // nombreUsuarioElemento.appendChild(imagenElemento);
    nombreUsuarioElemento.appendChild(nombreElemento);
  }
});


function cerrarSesion() {
  // Borra las variables almacenadas en el local storage
  localStorage.removeItem('token');
  localStorage.removeItem('id_empresa');
  localStorage.removeItem('nombre_usuario');
  localStorage.removeItem('id_usuario');

  // Redirecciona al usuario a la página de inicio de sesión
  window.location.href = 'index.html';
}
