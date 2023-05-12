const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await axios.post("api/v1/user/login'", {
      email,
      password,
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    message.textContent = "Inicio de sesión exitoso";
  } catch (error) {
    message.textContent = error.response.data.error;
  }
});
