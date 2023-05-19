// (() => {
//   "use strict";

//   feather.replace({ "aria-hidden": "true" });
// })();


document.addEventListener("DOMContentLoaded", function () {
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
