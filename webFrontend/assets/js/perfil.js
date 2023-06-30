  document.addEventListener("DOMContentLoaded", async function () {

    const datos = await GetInformacionPerfil();
    const { rol_usuario, nom_usuario, app_usuario, apm_usuario, correo_usuario, nom_empresa, desc_empresa } = datos[0];
    el_nombre = this.getElementById("fullNameUser");
    el_empresa = this.getElementById("companyName");
    el_correo_usuario = this.getElementById("userMail");
    el_rol_usuario = this.getElementById("userRole");
    el_nombre_empresa = this.getElementById("companyName2");
    el_desc_empresa = this.getElementById("companyDesc");
    el_nombre.textContent = nom_usuario +' ' +app_usuario +' ' + apm_usuario;
    el_empresa.textContent =  nom_empresa;
    el_correo_usuario.textContent = correo_usuario;
    el_rol_usuario.textContent = rol_usuario;
    el_nombre_empresa.textContent = nom_empresa;
    el_desc_empresa.textContent = desc_empresa;

    const tokenUsuario = localStorage.getItem("token");
    if (!tokenUsuario) {
      window.location.href = "login.html";
    }

    const nombreUsuario = localStorage.getItem("nombre_usuario");
  
    if (nombreUsuario) {
      const nombreUsuarioElemento = document.getElementById("nombre-usuario");
      const nombreElemento = document.createElement("span");
      nombreElemento.innerHTML = "Hola " + nombreUsuario;
      nombreUsuarioElemento.appendChild(nombreElemento);
    }
    
    
  });
  
//Función para cerrar sesíón
function cerrarSesion() {
    // Borra las variables almacenadas en el local storage
    localStorage.removeItem('token');
    localStorage.removeItem('id_empresa');
    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('id_usuario');
  
    // Redirecciona al usuario a la página de inicio
    window.location.href = 'index.html';
  }

//Función Auxiliar para obtener informacion del usuario y la empresa
async function GetInformacionPerfil() {
    const id_empresa = localStorage.getItem("id_empresa");
    const id_usuario = localStorage.getItem("id_usuario");
    let url = `http://localhost:3000/api/v1/usuarios/info/` + id_usuario + '/' + id_empresa;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const { Data } = await response.json();
      return Data;
    } catch (error) {
      console.error(error);
      alert("Error en servicio usuarios/info");
    }
  }
  