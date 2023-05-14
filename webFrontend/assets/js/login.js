/*console.log("***======ENTRO=========***: ")

const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("***================***: ")
  const formData = new FormData(loginForm);
  const correo = formData.get("mail");
  const contrasena = formData.get("password");
  console.log("***FORMADATA***: ", formData)
  try {
    const response = await fetch("http://localhost:3000/api/v1/user/login", {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      
      body: JSON.stringify({
        correo,
        contrasena,
      }),
    });
    console.log("***BODY***: ", body)
    const responseData = await response.json();
    console.log('response:', response)
    const token = responseData.token;
    localStorage.setItem("token", token);
    message.textContent = "Inicio de sesión exitoso";
  } catch (error) {
    message.textContent = error.message;
  }
});
*/
console.log('entro');
const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log('sigue');
  const body = new FormData(loginForm);
  console.log('FORMDATA', body);
  const correo = body.get("email");
  const contrasena = body.get("password");
  console.log('FORMDATACONTENT', correo);
  console.log('FORMDATACONTENT', contrasena);
  console.log('BODY JSON', JSON.stringify(body));

  try {
    console.log('TRY');
    const response = await axios.post("http://localhost:3000/api/v1/user/login", {
      correo,
      contrasena
    });
    console.log('AFTER TRY', response);

    const token = response;
    localStorage.setItem("token", token);
    message.textContent = "Inicio de sesión exitoso";
  } catch (error) {
    message.textContent = "Error: " + error.message;
  }
});
