// Agregar un evento al botón de previsualizar
document.getElementById('previsualizar-btn').addEventListener('click', () => {
    // Crear un objeto de oferta con los datos del formulario
    const offer = {
        id: Date.now(), // Generar un ID único basado en la fecha y hora actual
        nombreEstudio: document.getElementById('studioName').value,
        tipoBusqueda: document.getElementById('tipoBusqueda').value,
        puesto: document.getElementById('puesto').value,
        ubicacion: document.getElementById('ubicacion').value,
        descripcion: document.getElementById('descripcion').value
    };

    // Obtener las ofertas desde LocalStorage y parsearlas a un array
    const offers = JSON.parse(localStorage.getItem('offers')) || [];
    // Añadir la nueva oferta al array de ofertas
    offers.push(offer);
    // Guardar el array de ofertas actualizado en LocalStorage
    localStorage.setItem('offers', JSON.stringify(offers));

    // Mostrar una alerta de confirmación
    alert('¡Oferta previsualizada y guardada!');
    // Redirigir al usuario a la página principal
    window.location.href = 'index.html';
});
