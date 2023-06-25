document.addEventListener("DOMContentLoaded", async function () {

  //Se valida que el usuario haya iniciado sesión 
  const tokenUsuario = localStorage.getItem("token");
  if (!tokenUsuario) {
    window.location.href = "login.html";
  }
  else{
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

    //Obtiene elementos tipo canvas para renderizar los gráficos
    var ctx = document.getElementById("myChart").getContext('2d');
    var ctxl = document.getElementById("myChart2").getContext('2d');
    var ctx3 = document.getElementById("myChart3").getContext('2d');
    var ctx4 = document.getElementById("myChart4").getContext('2d');
    var ctx5 = document.getElementById("myChart5").getContext('2d');
    var ctx6 = document.getElementById("myChart6").getContext('2d');

    // Objeto de traducciones de inglés a español para los meses
    const monthTranslations = {
      1: "Enero",
      2: "Febrero",
      3: "Marzo",
      4: "Abril",
      5: "Mayo",
      6: "Junio",
      7: "Julio",
      8: "Agosto",
      9: "Septiembre",
      10: "Octubre",
      11: "Noviembre",
      12: "Diciembre"
    };

    try {
      const data = await GetInformeConsumoMensual();
      var labels = data.map(item => monthTranslations[item.mes] || item.mes);
      var valuesTotal = data.map(item => item.total);
      var valuesCantidad = data.map(item => item.cant_consumos);

      //Primer gráfico Consumos
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `Total en $ por consumo mensual`,
            data: valuesTotal,
            backgroundColor: ['rgba(153, 102, 255, 0.2)'],
            borderColor: ['rgba(153, 102, 255, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
      //Segundo gráfico Consumos
      var myLineChart = new Chart(ctxl, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: "Cantidad de consumos por mes",
            data: valuesCantidad,
            backgroundColor: [
              'rgba(105, 0, 132, .2)',
            ],
            borderColor: [
              'rgba(200, 99, 132, .7)',
            ],
            borderWidth: 2
          }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
    try {
      const data = await GetMetricas();
      var labels = data.map(item => monthTranslations[item.mes] || item.mes);
      var valuesAsistEsperada = data.map(item => item.asistencia_esperada);
      var valuesPorcAsist = data.map(item => item.porc_obj_asist);
      var valuesAsistReal = data.map(item => item.asistencia_real);
      var q_emp_asiste = data.map(item => item.q_emp_asiste);
      var q_emp_consume = data.map(item => item.q_emp_consume);
      var valuesAlmReal = data.map(item => item.almuerzos_real);
      var valuesDeltaAlm = data.map(item => item.delta_almuerzos);
  
      //Primer Gráfico Alimentacion
      var myLineChart = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: "Asistencia Esperada",
            data: valuesAsistEsperada,
            backgroundColor: ['rgba(105, 0, 132, .2)'],
            borderColor: ['rgba(200, 99, 132, .7)'],
            borderWidth: 2
          },
          {
            label: "Asistencia Real",
            data: valuesAsistReal,
            backgroundColor: [
              'rgba(0, 137, 132, .2)',
            ],
            borderColor: [
              'rgba(0, 10, 130, .7)',
            ],
            borderWidth: 2
          }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
      //Segundo Gráfico Alimentacion
      var myHorizChart = new Chart(ctx4,  {
        "type": "bar",
        "data": {
          "labels": labels,
          "datasets": [{
            "label": "% cumplimiento Asistencia Esperada vs Real",
            "data": valuesPorcAsist,
            "fill": false,
            "backgroundColor": ["rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)", "rgba(255, 99, 132, 0.2)", 
            ],
            "borderColor": ["rgb(255, 159, 64)", "rgb(255, 205, 86)",
              "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)",
              "rgb(255, 99, 132)", 
            ],
            "borderWidth": 1
          }]
        },
        "options": {
          "scales": {
            "xAxes": [{
              "ticks": {
                "beginAtZero": true
              }
            }]
          }
        }
      });
      //Primer Gráfico Global
      var myChart5 = new Chart(ctx5,  {
        "type": "line",
        "data": {
          "labels": labels,
          "datasets": [{
            "label": "Asistencia Real",
            "data": valuesAsistReal,
            "fill": false,
            "backgroundColor": ["rgba(127, 63, 191, 0.2)"],
            "borderColor": ["rgb(127, 63, 191)"],
            "borderWidth": 1
          },
          {
            "label": "Almuerzos Real",
            "data": valuesAlmReal,
            "fill": false,
            "backgroundColor": ["rgba(255, 99, 132, 0.2)"],
            "borderColor": ["rgb(255, 99, 132)"],
            "borderWidth": 1
          },
          {
            "label": "Delta Almuerzos",
            "data": valuesDeltaAlm,
            "fill": false,
            "backgroundColor": ["rgba(63, 191, 191, 0.2)"],
            "borderColor": ["rgb(63, 191, 191)"],
            "borderWidth": 1
          }]
        },
        "options": {
          "scales": {
            "xAxes": [{
              "ticks": {
                "beginAtZero": true
              }
            }]
          }
        }
      });
      var myChart6 = new Chart(ctx6,  {
        "type": "bar",
        "data": {
          "labels": labels,
          "datasets": [{
            "label": "Empleados que almuerzan",
            "data": q_emp_consume,
            "fill": false,
            "backgroundColor": [
              "rgba(63, 191, 127, 0.2)"
            ],
            "borderColor": ["rgb(63, 191, 127)"],
            "borderWidth": 1
          },
          {
            "label": "Empleados que asisten",
            "data": q_emp_asiste,
            "fill": false,
            "backgroundColor": ["rgba(4, 76, 51, 0.2)"],
            "borderColor": ["rgb(4, 153, 102)"],
            "borderWidth": 1
          }]
        },
        "options": {
          "scales": {
            "xAxes": [{
              "ticks": {
                "beginAtZero": true
              }
            }]
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
    try {
      const data = await GetMetricas();
      createTable(data);
    } catch (error) {
      console.error(error);
    }

  }
});


//Función Auxiliar para obtener datos del primer y segundo gráfico Consumo
async function GetInformeConsumoMensual() {
  const id_empresa = localStorage.getItem("id_empresa");
  let url = `http://localhost:3000/api/v1/consumos/informeconsumos/${id_empresa}?`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    alert("Error en servicio informeconsumos");
  }
}
//Función Auxiliar para obtener datos de los demás gráficos
async function GetMetricas() {
  const id_empresa = localStorage.getItem("id_empresa");
  let url = `http://localhost:3000/api/v1/informemetricas/${id_empresa}?`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    alert("Error en servicio informemetricas");
  }
}

//Función Auxiliar crear tabla con méttricas
function createTable(data) {
  const table = document.getElementById("table-metricas");
  const tableHeader = document.createElement("thead");
  const tableBody = document.createElement("tbody");

  // Crear encabezado de la tabla
  const headers = Object.keys(data[0]);
  const headerNames = {
    annio: "Año",
    mes: "Mes",
    q_dias_mes: "Dias habil Mes",
    q_emp_total: "Empleados",
    q_emp_asiste: "Asisten",
    q_emp_consume: "Almuerzan",
    asistencia_real: "Asistencias",
    almuerzos_real: "Almuerzos",
    permisos: "Permisos",
    asistencia_esperada: "Asist. Esperada",
    almuerzos_esperado: "Alm. Esperado",
    porc_obj_asist: "% Asist.Esperada",
    delta_almuerzos: "Delta Almuerzos"

  };
  

  const headerRow = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    const columnName = headerNames[header] || header;
    th.textContent = columnName;
    th.setAttribute("scope", "col");
    headerRow.appendChild(th);
  });
  tableHeader.appendChild(headerRow);

  // Crear filas de datos
  data.forEach(item => {
    const row = document.createElement("tr");
    headers.forEach(header => {
      const td = document.createElement("td");
      td.textContent = item[header];
      row.appendChild(td);
    });
    tableBody.appendChild(row);
  });

  table.appendChild(tableHeader);
  table.appendChild(tableBody);
}


