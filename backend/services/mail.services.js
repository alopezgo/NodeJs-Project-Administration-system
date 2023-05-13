

function mailValidation(correo) {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(correo);
  }




  module.exports = {
    mailValidation,
    
  }