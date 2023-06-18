// Al cargar el DOM se verifica si existe un token de usuario en el local storage, 
// en caso contrario te direcciona al Login
document.addEventListener('DOMContentLoaded', function() {
  const tokenUsuario = localStorage.getItem("token");
  const isLoginPage = window.location.href.includes("login.html");

  if (!tokenUsuario && !isLoginPage) {
    window.location.href = "login.html";
  }
  cargarEmpresas();
});

const form = document.querySelector("#add-user-form");
const empresaSelect = document.querySelector("#id_empresa");

// Función asyncrona para cargar opciones de empresa en Formulario
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
      // Agrega las opciones al select.
      empresaSelect.innerHTML = "";
      empresas.forEach((empresa) => {
      const option = document.createElement("option");
      option.value = empresa.id; // Modificación aquí
      option.textContent = empresa.nombre;
      empresaSelect.appendChild(option);
    });
      // Código para agregar las opciones al select
    } else {
      alert("No se pudieron cargar las empresas");
    }

  } catch (error) {
    console.error(error);
    alert("Error en el servidor");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Obtener los datos del formulario.
  const id_rol = form.elements.id_rol.value;
  const id_empresa = form.elements.id_empresa.value;
  const rut = form.elements.rut.value;
  const dv = form.elements.dv.value;
  const nombre = form.elements.nombre.value;
  const ap_paterno = form.elements.ap_paterno.value;
  const ap_materno = form.elements.ap_materno.value;
  const correo = form.elements.correo.value;
  const contrasena = form.elements.contrasena.value;

  // Validar que se hayan completado todos los campos.
  if (
    !id_rol ||
    !id_empresa||
    !rut ||
    !dv ||
    !nombre ||
    !ap_paterno ||
    !ap_materno ||
    !correo ||
    !contrasena 

  ) {
    alert("Por favor, complete todos los campos.");
    return;
  }
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
        id_empresa: parseInt(id_empresa),
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

    if (data.success) {      
      Swal.fire({
        icon: "success",
        title: "Usuario insertado con éxito",
        text: "Se enviará un mensaje al correo ingresado.",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Limpiar los campos del formulario
        form.elements.id_rol.value = "";
        form.elements.id_empresa.value = "";
        form.elements.rut.value = "";
        form.elements.dv.value = "";
        form.elements.nombre.value = "";
        form.elements.ap_paterno.value = "";
        form.elements.ap_materno.value = "";
        form.elements.correo.value = "";
        form.elements.contrasena.value = "";
      });
    } else {
      // La solicitud falló.
      Swal.fire({
        icon: "error",
        title: "¡Error en el servidor!",
        // Agregar el mensaje de error en la alerta.
        text: data.message || "Ha ocurrido un error mientras se ingresaban los datos a la base",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  } catch (error) {
    console.error(error);
    alert("Ha ocurrido un error en el servidor");
  }
});
