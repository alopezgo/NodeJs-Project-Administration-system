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
    var values = data.map(item => item.total);

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total en $',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
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
