
const form = document.querySelector("#login-form");


form.addEventListener("submit", (event) => {

  event.preventDefault();

  // Get the form data.
  const email = form.elements.email.value;
  const password = form.elements.password.value;

  if (!email || !password) {
    alert("Se requiere correo y contraseña para iniciar sesión");
    return;
  }

  fetch("http://localhost:3000/api/v1/user/login", {
    method: "POST",
    body: JSON.stringify({
      correo: email,
      contrasena: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {

      if (response.status === 200) {
        // The login was successful.
        alert("Inicio de sesión exitoso");
    
      } else if (response.status === 401) {
        alert("Correo o contraseña incorrectos");
      } else {

        alert("Error en el servidor");
      }
    })
    .catch((error) => {
      // An error occurred.
      console.error(error);
      alert("Error al iniciar sesión");
    });
});
