
const form = document.querySelector("#add-user-form");


form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the form data.
  const id_rol = form.elements.id_rol.value;
  const correo = form.elements.correo.value;
  const contrasena = form.elements.contrasena.value;

  // Validaar que tenga todos los campos
  if (!id_rol || !correo || !contrasena) {
    alert("Se requiere correo y contraseña para iniciar sesión");
    return;
  }

  fetch("http://localhost:3000/api/v1/addUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_rol: parseInt(id_rol),
      correo,
      contrasena,
    }),
  })
  .then((response) => {
    if (response.status === 200) {
      // The request was successful.
      Swal.fire({
        icon: "success",
        title: "Usuario insertado con éxito",
        text: "Se enviará un mensaje al correo ingresado.",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
    } else {
      // The request failed.
      Swal.fire({
        icon: "error",
        title: "¡Error en el servidor!",
        text: "No se ha podido insertar el usuario.",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  })
    .catch((error) => {
      console.error(error);
      alert("Error al insertar usuario");
    });
});
