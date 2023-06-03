/* globals Chart:false, feather:false */

(() => {
  "use strict";

  feather.replace({ "aria-hidden": "true" });
})();

// const id_empresa = localStorage.getItem('id_empresa');
// console.log("id_empresa", id_empresa)

document.addEventListener("DOMContentLoaded", function () {
  const tokenUsuario = localStorage.getItem("token");
  const isLoginPage = window.location.href.includes("login.html");

  if (!tokenUsuario && !isLoginPage) {
    window.location.href = "login.html";
  }
  const nombreUsuario = localStorage.getItem("nombre_usuario");

  if (nombreUsuario) {
    const nombreUsuarioElemento = document.getElementById("nombre-usuario");

    const imagenElemento = document.getElementById("img-usuario");
    const nombreElemento = document.createElement("span");
    nombreElemento.innerHTML = "Hola " + nombreUsuario;

    nombreUsuarioElemento.appendChild(imagenElemento);
    nombreUsuarioElemento.appendChild(nombreElemento);
  }
});
