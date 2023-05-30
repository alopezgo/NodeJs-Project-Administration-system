document.addEventListener("DOMContentLoaded", function () {
  const tokenUsuario = localStorage.getItem("token");
  const isLoginPage = window.location.href.includes("login.html");

  if (!tokenUsuario && !isLoginPage) {
    window.location.href = "login.html";
  }
  if ($.fn.dataTable.isDataTable("#example")) {
    $("#example").dataTable().fnClearTable();
    $("#example").dataTable().fnDestroy();
  }
  $(document).ready(function () {
    var tabla_permiso = $("#example").DataTable({
      language: {
        destroy: true,
        url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
      },
      columns: [
        { title: "Empleado", data: "empleado" },
        { title: "Rut", data: "rut" },
        { title: "Motivo", data: "tipo" },
        { title: "Desde", data: "desde" },
        { title: "Hasta", data: "hasta" },
      ],
    });
    GetPermisos();

    // Obtener lista de permisos por Empresa
    function GetPermisos() {
      const id_empresa = localStorage.getItem("id_empresa");
      return $.ajax({
        url: "http://localhost:3000/api/v1/permisos/" + id_empresa,
        type: "GET",
        success: function (response) {
          const res = response;
          const permiso = res.data;
          permiso.forEach((fila) => {
            tabla_permiso.row
              .add({
                empleado: fila.empleado,
                rut: fila.rut,
                tipo: fila.tipo,
                desde: fila.desde,
                hasta: fila.hasta,
              })
              .draw();
          });
        },
      });
    }
  });

  //Se rellenan fechas de inputs tipo select en Formulario
  const id_empresa = localStorage.getItem("id_empresa");
  const url_empleados = "http://localhost:3000/api/v1/empleados/" + id_empresa;
  const url_tiposPermiso = "http://localhost:3000/api/v1/tipospermiso";
  const empleadoSelect = document.querySelector("#empleadoSelect");
  const permisoSelect = document.querySelector("#permisoSelect");
  cargarOptions(url_tiposPermiso, permisoSelect);
  cargarOptions(url_empleados, empleadoSelect);

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

  if (nombreUsuario) {
    const nombreUsuarioElemento = document.getElementById("nombre-usuario");

    const imagenElemento = document.getElementById("img-usuario");
    const nombreElemento = document.createElement("span");
    nombreElemento.innerHTML = "Hola " + nombreUsuario;

    nombreUsuarioElemento.appendChild(imagenElemento);
    nombreUsuarioElemento.appendChild(nombreElemento);
  }
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

    if (url === "http://localhost:3000/api/v1/tipospermiso") {
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
        option.value = opcion.id_tipo_permiso; // Modificación aquí
        const str = opcion.tipo_permiso;
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
        option.value = opcion.id_empleado; // Modificación aquí
        option.textContent = opcion.nom_empleado;
        select.add(option);
      });
    }
  } catch (error) {
    console.error(error);
    alert("Error al cargar las opciones");
  }
};

//Código para recibir opciones de formulario EN CONSTRUCCIÓN

const form = document.querySelector("#filtro-informe-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Obtener los datos del formulario.
  const empleadoSelect = form.elements.empleadoSelect.value;
  const permisoSelect = form.elements.permisoSelect.value;
  const fecha_desde = form.elements.fechaDesde.value;
  const fecha_hasta = form.elements.fechaHasta.value;

  // Validar que se hayan completado todos los campos.
  if (empleadoSelect == 0 || permisoSelect == 0 || !fecha_desde || !fecha_hasta ) {
    alert("Por favor, complete todos los campos.");
    return;
  }
  console.log(empleadoSelect, permisoSelect, fecha_desde, fecha_hasta);
  try {
    // Enviar los datos del formulario.
    const response = await fetch(
      "http://localhost:3000/api/v1/registrarPermiso",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_empleado: empleadoSelect,
          id_evento_permiso: permisoSelect,
          fecha_desde: fecha_desde,
          fecha_hasta: fecha_hasta
        }),
      }
    );
    const data = await response.json();

    console.log(parseInt(empleadoSelect), parseInt(permisoSelect), fecha_desde, fecha_hasta);

    if (data.success) {
      // La solicitud se realizó correctamente.
      //Se obtienen fechas actuales para recargar de inputs tipo date en Formulario
      var fecha = new Date(); //Fecha actual
      var mes = fecha.getMonth() + 1; //obteniendo mes
      var dia = fecha.getDate(); //obteniendo dia
      var ano = fecha.getFullYear(); //obteniendo año
      if (dia < 10) dia = "0" + dia; //agrega cero si es menor de 10
      if (mes < 10) mes = "0" + mes; //agrega cero si es menor de 10

      Swal.fire({
        icon: "success",
        title: "Permiso registrado con éxito",
        text: "Se ha registrado el permiso en la base de datos",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Limpiar los campos del formulario
        form.elements.empleadoSelect.value = "0";
        form.elements.permisoSelect.value = "0";
        form.elements.fechaDesde.value = ano + "-" + mes + "-" + dia;
        form.elements.fechaHasta.value = ano + "-" + mes + "-" + dia;
      });
    } else {
      // La solicitud falló.
      Swal.fire({
        icon: "error",
        title: "¡Error en el servidor!",
        // Agregar el mensaje de error en la alerta.
        text: data.message || "Ha ocurrido un error en el servidor.",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  } catch (error) {
    console.error(error);
    alert("Ha ocurrido un error en el servidor");
  }
  
});

//Convertir a CSV
function tableToCSV() {
  // Variable to store the final csv data
  var csv_data = [];

  // Get each row data
  var rows = document.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    // Get each column data
    var cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      // Get the text data of each cell
      // of a row and push it to csvrow
      csvrow.push(cols[j].innerHTML);
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }

  // Combine each row data with new line character
  csv_data = csv_data.join("\n");

  // Call this function to download csv file
  downloadCSVFile(csv_data);
};

function downloadCSVFile(csv_data) {
  // Create CSV file object and feed
  // our csv_data into it
  CSVFile = new Blob([csv_data], {
    type: "text/csv;charset=utf-8",
  });

  // Create to temporary link to initiate
  // download process
  var temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = "registros.csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to
  // trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
};

//Convertir a PDF
function tableToPDF() {
  var sTable = document.getElementsByTagName("table")[0];
  var style = "<style>";
  style = style + "table {width: 100%;font: 17px Calibri;}";
  style =
    style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
  style = style + "padding: 2px 3px;text-align: center;}";
  style = style + "</style>";

  // CREATE A WINDOW OBJECT.
  var win = window.open("", "", "height=700,width=700");

  win.document.write("<html><head>");
  win.document.write("<title>Print</title>"); // <title> FOR PDF HEADER.
  win.document.write(style); // ADD STYLE INSIDE THE HEAD TAG.
  win.document.write("</head><body>");
  win.document.write("<table>" + sTable.innerHTML + "</table>"); // THE TABLE CONTENTS INSIDE THE BODY TAG.
  win.document.write("</body></html>");
  win.document.close(); // CLOSE THE CURRENT WINDOW.

  win.print(); // PRINT THE CONTENTS.
}

  
//Se invoca funcion para cargar iconos de menu lateral rapidamente
/* globals Chart:false, feather:false */
(() => {
  "use strict";

  feather.replace({ "aria-hidden": "true" });
})();