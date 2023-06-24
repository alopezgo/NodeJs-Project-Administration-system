document.addEventListener("DOMContentLoaded", function () {
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
  });

function toggleAnswer(index) {
      var answer = document.getElementById('answer-' + index);
      
      if (answer.classList.contains('show')) {
        answer.classList.remove('show');
      } else {
        var allAnswers = document.getElementsByClassName('faq-answer');
        for (var i = 0; i < allAnswers.length; i++) {
          allAnswers[i].classList.remove('show');
        }
        answer.classList.add('show');
      }
    }