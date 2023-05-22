document.addEventListener('DOMContentLoaded', function() {
  cargarEmpresas();
});

const form = document.querySelector("#add-user-form");
const empresaSelect = document.querySelector("#id_empresa");

// Función para cargar las empresas en el select.
async function cargarEmpresas() {
  try {
    // Obtiene las empresas.
    const response = await fetch("http://localhost:3000/api/v1/empresas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
 

    // Verifica si la respuesta es un objeto y lo convierte en un arreglo.
    const empresas = Array.isArray(data.data) ? data.data : [data.data];


    if (Array.isArray(empresas) && empresas.length > 0) {
      // Código para agregar las opciones al select
    } else {
      alert("No se pudieron cargar las empresas");
    }

    // Agrega las opciones al select.
    empresaSelect.innerHTML = "";
    empresas.forEach((empresa) => {
      const option = document.createElement("option");
      option.value = empresa.nombre; // Modificación aquí
      option.textContent = empresa.nombre;
      empresaSelect.appendChild(option);
    });
    
  } catch (error) {
    console.error(error);
    alert("Error al cargar las empresas");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Obtener los datos del formulario.
  const id_rol = form.elements.id_rol.value;
  const rut = form.elements.rut.value;
  const dv = form.elements.dv.value;
  const nombre = form.elements.nombre.value;
  const ap_paterno = form.elements.ap_paterno.value;
  const ap_materno = form.elements.ap_materno.value;
  const correo = form.elements.correo.value;
  const contrasena = form.elements.contrasena.value;
  const nombre_empresa = empresaSelect.value;

  // Validar que se hayan completado todos los campos.
  if (
    !id_rol ||
    !rut ||
    !dv ||
    !nombre ||
    !ap_paterno ||
    !ap_materno ||
    !correo ||
    !contrasena ||
    !nombre_empresa
  ) {
    alert("Por favor, complete todos los campos.");
    return;
  }
  console.log(id_empresa)
  try {
    // Enviar los datos del formulario.
    const response = await fetch("http://localhost:3000/api/v1/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_estado: 1,
        id_rol: parseInt(id_rol),
        nombre_empresa,
        rut,
        dv,
        nombre,
        ap_paterno,
        ap_materno,
        correo,
        contrasena,
      }),
    });
    const data = await response.json();

    console.log(  1,
       parseInt(id_rol),
       nombre_empresa,
      rut,
      dv,
      nombre,
      ap_paterno,
      ap_materno,
      correo,
      contrasena);
  
    

    if (data.success) {
      // La solicitud se realizó correctamente.
      Swal.fire({
        icon: "success",
        title: "Usuario insertado con éxito",
        text: "Se enviará un mensaje al correo ingresado.",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
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

cargarEmpresas();
