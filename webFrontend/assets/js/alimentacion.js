// JavaScript
document.addEventListener("DOMContentLoaded", function () {
  llenarTabla();
});

const tbody = document.querySelector("#tb-alimentacion");

async function llenarTabla(){
  // Hacer petición GET a la API
    const response = await fetch("http://localhost:3000/api/v1/consumos/3");
    const data = await response.json();

    const consumo = Array.isArray(data.data) ? data.data : [data.data];

    console.log(consumo);

    if (Array.isArray(consumo) && consumo.length > 0) {
        consumo.forEach((consumo) => {
            // Recorrer array de objetos y crear filas en la tabla
            const fila = document.createElement("tr");
            const celdaNombre = document.createElement("td");
            const celdaTipo = document.createElement("td");
            const celdaDT = document.createElement("td");
            const celdaPrecio = document.createElement("td");

            celdaNombre.innerHTML = consumo.nom_empleado; 
            celdaTipo.innerHTML = consumo.tipo_consumo;
            celdaDT.innerHTML = consumo.dt_consumo;
            celdaPrecio.innerHTML = consumo.precio;

            fila.appendChild(celdaNombre);
            fila.appendChild(celdaTipo);
            fila.appendChild(celdaDT);
            fila.appendChild(celdaPrecio);

            tbody.appendChild(fila);
        });
    } else {
      alert("No se pudieron cargar las empresas");
    }

    
}