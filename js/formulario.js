//Declaro variables del formulario
let nombreEstudio = document.getElementById('studioName');
let tipoBusqueda = document.getElementById('tipoBusqueda');
let puesto = document.getElementById('puesto');
let ubicacion = document.getElementById('ubicacion');
let descripcion = document.getElementById('descripcion');
let terminos = document.getElementById('terminos');

// Agregar eventos de entrada a los campos del formulario
nombreEstudio.addEventListener('input', validarFormulario);
tipoBusqueda.addEventListener('change', validarFormulario);
puesto.addEventListener('input', validarFormulario);
ubicacion.addEventListener('input', validarFormulario);
descripcion.addEventListener('input', validarFormulario);
terminos.addEventListener('change', validarFormulario);


// Agregar un evento al botón de previsualizar
document.getElementById('previsualizar-btn').addEventListener('click', () => {
    // Crear un objeto de oferta con los datos del formulario

    const offer = {
        id: Date.now(), // Generar un ID único basado en la fecha y hora actual
        nombreEstudio: nombreEstudio.value,
        tipoBusqueda: tipoBusqueda.value,
        puesto: puesto.value,
        ubicacion: ubicacion.value,
        descripcion: descripcion.value
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

// Función para validar el formulario
function validarFormulario() {
     // Obtener los valores de los inputs
     const nombreEstudioValue = nombreEstudio.value.trim();
     const tipoBusquedaValue = tipoBusqueda.value;
     const puestoValue = puesto.value.trim();
     const ubicacionValue = ubicacion.value.trim();
     const descripcionValue = descripcion.value.trim();

      // Definir las variables de validación
    const isNombreEstudioValido = nombreEstudioValue.length >= 3 && nombreEstudioValue.length <= 50;
    const isTipoBusquedaValido = tipoBusquedaValue !== '';
    const isPuestoValido = puestoValue.length >= 3 && puestoValue.length <= 50;
    const isUbicacionValida = ubicacionValue.length >= 3 && ubicacionValue.length <= 50;
    const isDescripcionValida = descripcionValue.length >= 10 && descripcionValue.length <= 200;

 
     // Validar cada campo y mostrar mensajes de error
     let isValid = true;
 
     // Validación Nombre del Estudio
     if (nombreEstudioValue.length < 3) {
         document.getElementById('studioNameValidacion').innerText = 'El nombre del estudio debe tener al menos 3 caracteres y no mas de 50.';
         document.getElementById('studioNameValidacion').style.display = 'block';
         isValid = false;
     } else {
         document.getElementById('studioNameValidacion').style.display = 'none';
     }
 
     // Validación Tipo de Búsqueda
     if (tipoBusquedaValue === '') {
         document.getElementById('tipoBusquedaValidacion').innerText = 'Por favor, seleccione una opción.';
         document.getElementById('tipoBusquedaValidacion').style.display = 'block';
         isValid = false;
     } else {
         document.getElementById('tipoBusquedaValidacion').style.display = 'none';
     }
 
     // Validación Puesto
     if (puestoValue.length < 3) {
         document.getElementById('puestoValidacion').innerText = 'El puesto debe tener al menos 3 caracteres y no mas de 50.';
         document.getElementById('puestoValidacion').style.display = 'block';
         isValid = false;
     } else {
         document.getElementById('puestoValidacion').style.display = 'none';
     }
 
     // Validación Ubicación
     if (ubicacionValue.length < 3) {
         document.getElementById('ubicacionValidacion').innerText = 'La ubicación debe tener al menos 3 caracteres y no mas de 50.';
         document.getElementById('ubicacionValidacion').style.display = 'block';
         isValid = false;
     } else {
         document.getElementById('ubicacionValidacion').style.display = 'none';
     }
 
     // Validación Descripción
     if (descripcionValue.length < 10) {
         document.getElementById('descripcionValidacion').innerText = 'La descripción debe tener al menos 10 caracteres y no mas de 200.';
         document.getElementById('descripcionValidacion').style.display = 'block';
         isValid = false;
     } else {
         document.getElementById('descripcionValidacion').style.display = 'none';
     }

    // Habilitar o deshabilitar el botón de previsualizar
    const previsualizarBtn = document.getElementById('previsualizar-btn');
    previsualizarBtn.disabled = !(isNombreEstudioValido && isTipoBusquedaValido && isPuestoValido && isUbicacionValida && isDescripcionValida);
}
