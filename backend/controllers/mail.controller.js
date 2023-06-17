const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {
  try {
    const { correo } = req.body;
    console.log(correo)

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
        // Configuración del servicio de correo saliente (SMTP)
        service: 'gmail',
        auth: {
          user: 'sac.mailservice@gmail.com', // Cambia esto al correo desde el que deseas enviar los correos
          pass: 'kztxpulnfukgwolr', // Cambia esto a tu contraseña de correo
        },
      });

    // Configurar el contenido del correo
    const mailOptions = {
      from: 'sac.mailservice@gmail.com', // Cambia esto al correo desde el que deseas enviar los correos
      to: correo, // Cambia esto a la dirección de correo a la que deseas enviar los correos
      subject: 'Solicitud recibida',
      text: 'Se ha recibido su solicitud para comenzar a usar nuestra aplicación.',
    };

    // Enviar el correo a la dirección especificada y al correo recibido en req.body
    const sendTo = [correo, mailOptions.to];
    const sendEmailPromises = sendTo.map((to) => {
      mailOptions.to = to;
      return transporter.sendMail(mailOptions);
    });

    // Esperar a que se envíen ambos correos
    await Promise.all(sendEmailPromises);

    // Respuesta exitosa
    console.log(`Correo enviado a: ${correo}`)
    return res.status(200).send('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo', error);
    return res.status(500).send('Error en el servidor');
  }
};
