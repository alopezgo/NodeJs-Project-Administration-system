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
          return response.json();
        
      } else if (response.status === 401) {
        alert("Correo o contraseña incorrectos");
        throw new Error("Correo o contraseña incorrectos");
      } else if (response.status === 403){
        throw new Error("holaaa ");
      }else {
        throw new Error("Error en el servidor");
      }
      
    })
    .then((data) => {
      // Extract the required data from the response
      const { token, data: userData } = data;
      
      const { id_empresa, nombre, id } = userData[0];     

      // Save the required data in localStorage or session storage
      localStorage.setItem("token", token);
      localStorage.setItem("id_empresa", id_empresa);
      localStorage.setItem("nombre_usuario", nombre);
      localStorage.setItem("id_usuario", id); 
      localStorage.setItem("id_rol", id_rol); 
     
     

      // Redirect to the next page
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Error al iniciar sesión : " + error.message);
    });
});
