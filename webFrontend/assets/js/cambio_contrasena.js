document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#cambio-contrasena-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombreUsuario = localStorage.getItem("nombre_usuario");
  
    if (nombreUsuario) {
      const nombreUsuarioElemento = document.getElementById("nombre-usuario");
  
      const imagenElemento = document.getElementById("img-usuario");
      const nombreElemento = document.createElement("span");
      nombreElemento.innerHTML = "Hola " + nombreUsuario;
  
      nombreUsuarioElemento.appendChild(imagenElemento);
      nombreUsuarioElemento.appendChild(nombreElemento);
    }
  
      const contrasenaActual = document.querySelector('#contrasena_antigua').value;
      const nuevaContrasena = document.querySelector('#contrasena_nueva').value;
      try {
        // Obtener el ID de usuario del almacenamiento local
        const idUsuario = localStorage.getItem('id_usuario');
  
        // Construir el objeto de solicitud
        const data = {
          contrasena_actual: contrasenaActual,
          nueva_contrasena: nuevaContrasena,
        };
  
        // Realizar la solicitud al servidor
        const response = await fetch(`http://localhost:3000/api/v1/usuarios/${idUsuario}/updatePass`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        // Analizar la respuesta JSON
        const result = await response.json();
  
        if (response.ok) {
          // La contraseña se actualizó correctamente
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: result.message,
          }).then(() => {
            // Restablecer los campos del formulario
            window.location.href = "perfil.html";
            form.reset();
            
          });
        } else {
          // Hubo un error al actualizar la contraseña
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar contraseña',
            text: result.message,
          });
        }
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: 'Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    });
  });
  