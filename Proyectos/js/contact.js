document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Obtener los valores del formulario
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Validación básica
      if (!name || !email || !subject || !message) {
        formMessage.textContent = 'Por favor, completa todos los campos requeridos.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }
      
      // Aquí normalmente enviarías los datos a un servidor
      // Simulamos una respuesta exitosa después de 1 segundo
      formMessage.textContent = 'Enviando mensaje...';
      formMessage.className = 'form-message';
      formMessage.style.display = 'block';
      
      setTimeout(() => {
        // Simulación de respuesta exitosa
        formMessage.textContent = '¡Gracias por tu mensaje! Te contactaremos pronto.';
        formMessage.className = 'form-message success';
        
        // Limpiar el formulario
        contactForm.reset();
      }, 1000);
    });
  }
});