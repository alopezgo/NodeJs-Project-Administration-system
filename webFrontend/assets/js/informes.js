(() => {
  "use strict";

  feather.replace({ "aria-hidden": "true" });
  
})();



document.addEventListener("DOMContentLoaded", async function () {
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

var ctx = document.getElementById("myChart").getContext('2d');
var ctxl = document.getElementById("myChart2").getContext('2d');
var ctx3 = document.getElementById("myChart3").getContext('2d');
var ctx4 = document.getElementById("myChart4").getContext('2d');

const id_empresa = localStorage.getItem("id_empresa");

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

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total en $ por consumo mensual',
          data: valuesTotal,
          backgroundColor: [
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            //'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            // 'rgba(255,99,132,1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            //'rgba(255, 159, 64, 1)'
          ],
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
    //line
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
    var valuesObjAsistencia = data.map(item => item.objetivo_asistencia);
    var valuesPorcObjAsistencia = data.map(item => item.porc_obj_asist);
    var valuesAsistencia = data.map(item => item.asistencias);
    var valuesPermisos = data.map(item => item.permisos);
    var valuesAlmuerzos = data.map(item => item.almuerzos);
    var valuesmaxAlmuerzos = data.map(item => item.control_almuerzos);

    //line
var myLineChart = new Chart(ctx3, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: "Asistencia Esperada",
      data: valuesObjAsistencia,
      backgroundColor: [
        'rgba(105, 0, 132, .2)',
      ],
      borderColor: [
        'rgba(200, 99, 132, .7)',
      ],
      borderWidth: 2
    },
    {
      label: "Asistencia Real",
      data: valuesAsistencia,
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
var myHorizChart = new Chart(ctx4,  {
  "type": "bar",
  "data": {
    "labels": labels,
    "datasets": [{
      "label": "Porcentaje cumplimineto Asistencia Esperada",
      "data": valuesPorcObjAsistencia,
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
  } catch (error) {
    console.error('Error:', error);
  }



});

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
