const nodemailer = require('nodemailer');

function mailValidation(correo) {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(correo);
  }

async function sendEmail (to, subject, text) {
    try {
      // Configurar el transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sac.mailservice@gmail.com',
          pass: 'kztxpulnfukgwolr',
        },
      });
  
      // Configurar el contenido del correo
      const mailOptions = {
        from: 'sac.mailservice@gmail.com',
        to: to,
        subject: subject,
        text: text,
      };
  
      // Enviar el correo
      await transporter.sendMail(mailOptions);
  
      console.log(`Correo enviado a: ${to}`);
      return true;
    } catch (error) {
      console.error('Error al enviar el correo', error);
      throw new Error('Error en el servidor');
    }
  };
  




  module.exports = {
    mailValidation,
    sendEmail
    
  }