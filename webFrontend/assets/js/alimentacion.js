/* globals Chart:false, feather:false */

(() => {
  "use strict";

  feather.replace({ "aria-hidden": "true" });

})();


document.addEventListener("DOMContentLoaded", function () {

  const nombreUsuario = localStorage.getItem("nombre_usuario");
  const id_empresa = localStorage.getItem("id_empresa");
  const url_centros = "http://localhost:3000/api/v1/centrocosto/" + id_empresa;
  const url_tiposConsumo = "http://localhost:3000/api/v1/tiposconsumo";
  const centroSelect = document.querySelector("#centroSelect");
  const consumoSelect = document.querySelector("#consumoSelect");
  cargarOptions(url_centros, centroSelect);
  cargarOptions(url_tiposConsumo, consumoSelect);

  window.onload = function () {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear(); //obteniendo año
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    document.getElementById("fechaDesde").value = ano + "-" + mes + "-" + dia;
    document.getElementById("fechaHasta").value = ano + "-" + mes + "-" + dia;
  };

  if (nombreUsuario) {
    const nombreUsuarioElemento = document.getElementById("nombre-usuario");

    const imagenElemento = document.getElementById("img-usuario");
    const nombreElemento = document.createElement("span");
    nombreElemento.innerHTML = "Hola " + nombreUsuario;

    nombreUsuarioElemento.appendChild(imagenElemento);
    nombreUsuarioElemento.appendChild(nombreElemento);
  }

});

// Función para cargar options en Select.
async function cargarOptions(url, select) {
  try {
    // Obtiene los Centros
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    const data = res;

    // Verifica si la respuesta es un objeto y lo convierte en un arreglo.
    const opciones = Array.isArray(data.Data) ? data.Data : [data.Data];

    if (Array.isArray(opciones) && opciones.length > 0) {
      // Código para agregar las opciones al select
    } else {
      alert("No se pudieron cargar las opciones");
    }

    if (url === "http://localhost:3000/api/v1/tiposconsumo") {
      // Agrega las opciones al select.
      select.innerHTML = "";
      opciones.forEach((opcion) => {
        const option = document.createElement("option");
        option.value = opcion.id_tipo_consumo; // Modificación aquí
        const str = opcion.tipo_consumo;
        const str2 = str.charAt(0).toUpperCase() + str.slice(1);
        option.textContent = str2;
        select.appendChild(option);
      });
    } else {
      select.innerHTML = "";
      opciones.forEach((opcion) => {
        const option = document.createElement("option");
        option.value = opcion.id; // Modificación aquí
        option.textContent = opcion.centro;
        select.appendChild(option);
      });

    } 
    
  } catch (error) {
    console.error(error);
    alert("Error al cargar las opciones");
  }
}

//Conectar Formulario con servicio http://localhost:3000/api/v1/consumos/:id_empresa/:ccosto/:desde/:hasta
// 
