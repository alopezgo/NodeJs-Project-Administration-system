document.addEventListener("DOMContentLoaded", function () {

  //Se valida que el usuario haya iniciado sesión 
  const tokenUsuario = localStorage.getItem("token");
  if (!tokenUsuario) {
    window.location.href = "login.html";
  }
  else {
    //Se invoca funcion para cargar iconos de menu lateral rapidamente
    "use strict";
    feather.replace({ "aria-hidden": "true" });

    //Se rellena menu lateral con Nombre del Usuario
    const nombreUsuario = localStorage.getItem("nombre_usuario");
    const nombreUsuarioElemento = document.getElementById("nombre-usuario");
    const nombreElemento = document.createElement("span");

    if (nombreUsuario != "") {
      nombreElemento.innerHTML = "Hola " + nombreUsuario;
    } 
    else {
      nombreElemento.innerHTML = "Hola";
    }

    nombreUsuarioElemento.appendChild(nombreElemento);

    //Se llama a función Getconsumo para traer datos en la tabla
    var tabla_consumo = $("#example").DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
      },
      columns: [
        { title: "Centro", data: "centro_costos" },
        { title: "Empleado", data: "nom_empleado" },
        { title: "Rut", data: "rut" },
        { title: "Consumo", data: "tipo_consumo" },
        { title: "Fecha", data: "fecha" },
        { title: "Hora", data: "hora" },
        { title: "Precio", data: "precio" },
      ],
    });

    try {
      GetConsumos(tabla_consumo);
    }catch(error){
      console.error(error);
      alert("Error al traer registros de alimentación");
    }

    //Se llama a función cargarOptions para obtener options en select de centro costos y tipo consumo
    const id_empresa = localStorage.getItem("id_empresa");
    const url_centros = "http://localhost:3000/api/v1/centrocosto/" + id_empresa;
    const url_tiposConsumo = "http://localhost:3000/api/v1/tiposconsumo";
    const centroSelect = document.querySelector("#centroSelect");
    const consumoSelect = document.querySelector("#consumoSelect");

    try{
      cargarOptions(url_centros, centroSelect);
      cargarOptions(url_tiposConsumo, consumoSelect);
    }catch(error){
      console.error(error);
      alert("Error al cargar opciones en formulario");
    }

    //Se rellenan opciones de inputs tipo date en Formulario
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear(); //obteniendo año
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    document.getElementById("fechaDesde").value = ano + "-" + mes + "-" + dia;
    document.getElementById("fechaHasta").value = ano + "-" + mes + "-" + dia;
  }
  
});

//Se obtiene elemento formulario
const form = document.querySelector("#filtro-informe-form");
//cuando ocurra el evento submit se llama a la api consumo nuevamente
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Se obtienen valores del formulario
  const centro_costos = form.elements.centroSelect.value;
  const tipo_consumo = form.elements.consumoSelect.value;
  const fecha_desde = form.elements.fechaDesde.value;
  const fecha_hasta = form.elements.fechaHasta.value;

  //convierte fechas a date para validar que fecha desde es menor o igual a fecha_hasta
  const fechaDesdeObj = new Date(fecha_desde);
  const fechaHastaObj = new Date(fecha_hasta);
  if (fechaDesdeObj > fechaHastaObj) {
    alert("La fecha desde no puede ser mayor que la fecha hasta");
  }
  else {

      //Si la tabla ya existe se elimina informacion y se borra la tabla
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
        { title: "Centro", data: "centro_costos" },
        { title: "Empleado", data: "nom_empleado" },
        { title: "Rut", data: "rut" },
        { title: "Consumo", data: "tipo_consumo" },
        { title: "Fecha", data: "fecha" },
        { title: "Hora", data: "hora" },
        { title: "Precio", data: "precio" },
      ],
    });
  
    try {
      GetConsumosPorParametros(centro_costos, tipo_consumo, fecha_desde, fecha_hasta);
    }catch(error){
      console.error(error);
      alert("Error al generar informe")
    }

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

// Función Auxiliar para Obtener lista de Consumos por Empresa
function GetConsumos(tabla_consumo) {
  const id_empresa = localStorage.getItem("id_empresa");
  // Mostrar mensaje de carga
  const loadingMessage = document.getElementById("cargando");
  loadingMessage.textContent = "Cargando...";

  return $.ajax({
    url: `http://localhost:3000/api/v1/consumos/${id_empresa}?`,
    type: "GET",
    success: function (response) {
      const res = response;
      const consumo = res.data;
      consumo.forEach((fila) => {
        tabla_consumo.row
          .add({
            centro_costos: fila.centro_costos,
            nom_empleado: fila.nom_empleado,
            rut: fila.rut,
            tipo_consumo: fila.tipo_consumo,
            fecha: fila.fecha,
            hora: fila.hora,
            precio: fila.precio,
          })
          .draw();
      });
      // Eliminar mensaje de carga
      loadingMessage.remove();
    },
  });
}
// Función Auxiliar para Obtener lista de Consumos aplicando filtros del Formulario
function GetConsumosPorParametros(centro_costos, tipo_consumo, fecha_desde, fecha_hasta) {
  const id_empresa = localStorage.getItem("id_empresa");
  // Mostrar mensaje de carga
  let cargaMensaje = document.getElementById("cargando2");
  cargaMensaje.textContent = "Cargando...";

  let url_params = `http://localhost:3000/api/v1/consumos/${id_empresa}?`; 
  if (centro_costos != 0) {
    url_params += `&centro=${centro_costos}`;
  }
  if (tipo_consumo != 0) {
    url_params += `&consumo=${tipo_consumo}`;
  }
  url_params += `&desde=${fecha_desde}&hasta=${fecha_hasta}`;
  return $.ajax({
    url: url_params,
    type: "GET",
    success: function (response) {
      const res = response;
      const consumo = res.data;
      consumo.forEach((fila) => {
        table.row
          .add({
            centro_costos: fila.centro_costos,
            nom_empleado: fila.nom_empleado,
            rut: fila.rut,
            tipo_consumo: fila.tipo_consumo,
            fecha: fila.fecha,
            hora: fila.hora,
            precio: fila.precio,
          })
          .draw();
      });
      // Eliminar mensaje de carga
      cargaMensaje.textContent="";
    },
  });
  
}

//Función auxiliar para convertir tabla a CSV
function tableToCSV() {
  var csv_data = [];
  var rows = document.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].querySelectorAll("td,th");
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      csvrow.push(cols[j].innerHTML);
    }

    csv_data.push(csvrow.join(","));
  }
  csv_data = csv_data.join("\n");

  downloadCSVFile(csv_data);
};

//Función auxiliar para descargar CSV

function downloadCSVFile(csv_data) {

  var fecha = new Date();
  CSVFile = new Blob([csv_data], {
    type: "text/csv;charset=utf-8",
  });

  var temp_link = document.createElement("a");
  
  temp_link.download = "registrosAlimentacion_" + fecha + ".csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  temp_link.click();
  document.body.removeChild(temp_link);
};

//Función auxiliar para convertir tabla en nueva ventana y poder imprimir o guardar como pdf
function tableToPDF() {
  var sTable = document.getElementsByTagName("table")[0];
  var style = "<style>";
  style = style + "table {width: 100%;font: 17px Calibri;}";
  style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
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