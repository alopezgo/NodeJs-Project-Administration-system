document.addEventListener("DOMContentLoaded", function () {
  //Se establecen opciones de la tabla y se llama a función Getconsumo
  var tabla_consumo = $("#example").DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    },
    columns: [
      { title: "Empleado", data: "nom_empleado" },
      { title: "Rut", data: "rut" },
      { title: "Consumo", data: "tipo_consumo" },
      { title: "Fecha", data: "fecha" },
      { title: "Hora", data: "hora" },
      { title: "Precio", data: "precio" },
    ],
  });
  GetConsumos();

  // Función Auxiliar para Obtener lista de Consumos por Empresa
  function GetConsumos() {
    const id_empresa = localStorage.getItem("id_empresa");
    return $.ajax({
      url: "http://localhost:3000/api/v1/consumos/" + id_empresa,
      type: "GET",
      success: function (response) {
        const res = response;
        const consumo = res.data;
        consumo.forEach((fila) => {
          tabla_consumo.row
            .add({
              nom_empleado: fila.nom_empleado,
              rut: fila.rut,
              tipo_consumo: fila.tipo_consumo,
              fecha: fila.fecha,
              hora: fila.hora,
              precio: fila.precio,
            })
            .draw();
        });
      },
    });
  }

  //Se rellenan fechas de inputs tipo select en Formulario
  const id_empresa = localStorage.getItem("id_empresa");
  const url_centros = "http://localhost:3000/api/v1/centrocosto/" + id_empresa;
  const url_tiposConsumo = "http://localhost:3000/api/v1/tiposconsumo";
  const centroSelect = document.querySelector("#centroSelect");
  const consumoSelect = document.querySelector("#consumoSelect");
  cargarOptions(url_centros, centroSelect);
  cargarOptions(url_tiposConsumo, consumoSelect);

  //Se rellenan opciones de inputs tipo date en Formulario
  var fecha = new Date(); //Fecha actual
  var mes = fecha.getMonth() + 1; //obteniendo mes
  var dia = fecha.getDate(); //obteniendo dia
  var ano = fecha.getFullYear(); //obteniendo año
  if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
  if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
  document.getElementById("fechaDesde").value = ano + "-" + mes + "-" + dia;
  document.getElementById("fechaHasta").value = ano + "-" + mes + "-" + dia;

  //Se rellena menu lateral con Nombre del Usuario
  const nombreUsuario = localStorage.getItem("nombre_usuario");
  const nombreUsuarioElemento = document.getElementById("nombre-usuario");
  const imagenElemento = document.getElementById("img-usuario");
  const nombreElemento = document.createElement("span");

  if (nombreUsuario != "") {
    nombreElemento.innerHTML = "Hola " + nombreUsuario;
  } else {
    nombreElemento.innerHTML = "Mi cuenta";
  }
  nombreUsuarioElemento.appendChild(imagenElemento);
  nombreUsuarioElemento.appendChild(nombreElemento);
});

// Función auxiliar para cargar options en Select.
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
      let newOption = new Option(
        (text = "Seleccionar"),
        (value = "0"),
        (defaultSelected = true),
        (selected = true)
      );
      select.add(newOption);
      opciones.forEach((opcion) => {
        const option = document.createElement("option");
        option.value = opcion.id_tipo_consumo; // Modificación aquí
        const str = opcion.tipo_consumo;
        const str2 = str.charAt(0).toUpperCase() + str.slice(1);
        option.textContent = str2;
        select.add(option);
      });
    } else {
      // Agrega las opciones al select.
      select.innerHTML = "";
      let newOption = new Option(
        (text = "Seleccionar"),
        (value = "0"),
        (defaultSelected = true),
        (selected = true)
      );
      select.add(newOption);
      opciones.forEach((opcion) => {
        const option = document.createElement("option");
        option.value = opcion.id; // Modificación aquí
        option.textContent = opcion.centro;
        select.add(option);
      });
    }
  } catch (error) {
    console.error(error);
    alert("Error al cargar las opciones");
  }
};

const form = document.querySelector("#filtro-informe-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Obtener los datos del formulario.
  const centro_costos = form.elements.centroSelect.value;
  const tipo_consumo = form.elements.consumoSelect.value;
  const fecha_desde = form.elements.fechaDesde.value;
  const fecha_hasta = form.elements.fechaHasta.value;
  console.log(centro_costos, tipo_consumo, fecha_desde, fecha_hasta);

  if ($.fn.dataTable.isDataTable("#example")) {
     $("#example").dataTable().fnClearTable();
    $("#example").dataTable().fnDestroy();
  }
  
  table = $("#example").DataTable({
    language: {
      destroy: true,
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    },
    columns: [
      { title: "Empleado", data: "nom_empleado" },
      { title: "Rut", data: "rut" },
      { title: "Consumo", data: "tipo_consumo" },
      { title: "Fecha", data: "fecha" },
      { title: "Hora", data: "hora" },
      { title: "Precio", data: "precio" },
    ],
  });

  await GetConsumosPorParametros();
  function GetConsumosPorParametros() {
    const id_empresa = localStorage.getItem("id_empresa");
    let url_params = `http://localhost:3000/api/v1/consumos/${id_empresa}?`; 
    if (centro_costos != 0) {
      url_params += `&centro=${centro_costos}`;
    }
    if (tipo_consumo != 0) {
      url_params += `&consumo=${tipo_consumo}`;
    }
    url_params += `&desde=${fecha_desde}&hasta=${fecha_hasta}`;
    console.log(url_params);
    return $.ajax({
      url: url_params,
      type: "GET",
      success: function (response) {
        const res = response;
        const consumo = res.data;
        consumo.forEach((fila) => {
          table.row
            .add({
              nom_empleado: fila.nom_empleado,
              rut: fila.rut,
              tipo_consumo: fila.tipo_consumo,
              fecha: fila.fecha,
              hora: fila.hora,
              precio: fila.precio,
            })
            .draw();
        });
      },
    });
  }
});
  
//Se invoca funcion para cargar iconos de menu lateral rapidamente
/* globals Chart:false, feather:false */
(() => {
  "use strict";

  feather.replace({ "aria-hidden": "true" });
})();

//Conectar Formulario con servicio http://localhost:3000/api/v1/consumos/:id_empresa/:ccosto/:desde/:hasta
//
