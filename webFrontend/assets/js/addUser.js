// Al cargar el DOM se verifica si existe un token de usuario en el local storage, 
// en caso contrario te direcciona al Login
document.addEventListener('DOMContentLoaded', function() {
  const tokenUsuario = localStorage.getItem("token");
  const isLoginPage = window.location.href.includes("login.html");

  if (!tokenUsuario && !isLoginPage) {
    window.location.href = "login.html";
  }
});

const form = document.querySelector("#add-user-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id_empresa = localStorage.getItem("id_empresa")
  // Obtener los datos del formulario.
  const id_rol = form.elements.id_rol.value;
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
