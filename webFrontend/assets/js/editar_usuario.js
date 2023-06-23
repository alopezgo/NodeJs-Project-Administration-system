$(document).ready(function () {

    

    var id = getParameterByName('id'); // Obtén el ID del usuario de la URL

    
    
  
    
    // Realiza una solicitud para obtener los datos del usuario por ID
    $.ajax({
      url: `http://localhost:3000/api/v1/usuarios/${id}`,
      type: 'GET',
      success: function (response) {
        
        
        var data = response;
        console.log('Data:', data.Data[0].rut);

       
  
        // Rellena los campos del formulario con los datos obtenidos
        $('#id_rol').val(data.Data[0].id_rol);
        $('#rut').val(data.Data[0].rut);
        $('#dv').val(data.Data[0].dv);
        $('#nombre').val(data.Data[0].nombre);
        $('#ap_paterno').val(data.Data[0].ap_paterno);
        $('#ap_materno').val(data.Data[0].ap_materno);
        $('#correo').val(data.Data[0].correo);
  
        


      },
      error: function (xhr, status, error) {
        console.log('Error al obtener el usuario');
      }
    });
  
    // Obtén el formulario y agrega un controlador de eventos para el evento de envío
    $('#add-user-form').submit(function (event) {
      event.preventDefault(); // Evita el envío del formulario por defecto
  
      // Obtén los valores de los campos del formulario
      var id_rol = $('#id_rol').val();
      var rut = $('#rut').val();
      var dv = $('#dv').val();
      var nombre = $('#nombre').val();
      var ap_paterno = $('#ap_paterno').val();
      var ap_materno = $('#ap_materno').val();
      var correo = $('#correo').val();
  
      // Crea un objeto de datos para enviar en la solicitud
      var data = {
        id_rol: id_rol,
        rut: rut,
        dv: dv,
        nombre: nombre,
        ap_paterno: ap_paterno,
        ap_materno: ap_materno,
        correo: correo
      };

       
      // Envía la solicitud PUT al servicio de actualización de usuario
      $.ajax({
        url: 'http://localhost:3000/api/v1/usuarios/update/' + id,
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (response) {
          // La solicitud se ha completado correctamente
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario actualizado exitosamente'
          }).then(function () {
            // Redirecciona a la página de usuarios después de cerrar el cuadro de diálogo
            window.location.href = 'usuarios.html';
          });
        },
        error: function (xhr, status, error) {
          // Se produjo un error durante la solicitud
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el usuario'
          });
          console.log(xhr.responseText);
        }
      });
    });
  
    function getParameterByName(name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var url = window.location.href;
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
      
  });
  