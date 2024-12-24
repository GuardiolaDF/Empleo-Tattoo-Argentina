// Función para renderizar las publicaciones desde LocalStorage
function renderOffers() {
    // Obtener las ofertas desde LocalStorage y parsearlas a un array
    const offers = JSON.parse(localStorage.getItem('offers')) || [];
    // Obtener el contenedor de la grilla de ofertas
    const offersGrid = document.getElementById('offersGrid');

    // Limpiar publicaciones previas
    offersGrid.innerHTML = '';

    // Iterar sobre cada oferta y crear una tarjeta para cada una
    offers.forEach((offer) => {
        // Crear un contenedor para la tarjeta
        const card = document.createElement('div');
        card.className = 'col';

        // Crear el contenido de la tarjeta con los datos de la oferta
        card.innerHTML = `
            <div class="card card-index" onclick="openOffer(${offer.id})">
                <div class="text-left">
                    <p class="text-black">${offer.nombreEstudio}</p>
                    <p class="text-light">busca</p>
                    <p class="text-black">${offer.puesto}</p>
                    <p class="text-light">en</p>
                    <p class="text-black">${offer.ubicacion}</p>
                </div>
            </div>`;
        
        // Añadir la tarjeta al contenedor de la grilla
        offersGrid.appendChild(card);
    });
}

// Función para abrir una publicación en el modal
function openOffer(id) {
    // Obtener las ofertas desde LocalStorage y parsearlas a un array
    const offers = JSON.parse(localStorage.getItem('offers')) || [];
    // Encontrar la oferta con el ID proporcionado
    const offer = offers.find(o => o.id === id);

    // Si no se encuentra la oferta, salir de la función
    if (!offer) return;

    // Llenar el modal con los datos de la oferta
    document.getElementById('modalTitle').innerText = offer.nombreEstudio;
    document.getElementById('modalSubtitle').innerHTML = `
        ${offer.tipoBusqueda} - ${offer.puesto}<br>En ${offer.ubicacion}`;
    document.getElementById('modalDescription').innerHTML = `
        <p>${offer.descripcion}</p>
        <p><strong>Días y horario:</strong> ${offer.diasHorario}</p>
        <p><strong>Modo de trabajo:</strong> ${offer.modoTrabajo}</p>
        <p><strong>Contacto:</strong> ${offer.contacto}</p>`;

    // Mostrar el modal
    const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    infoModal.show();
}

// Cargar publicaciones al cargar la página
document.addEventListener('DOMContentLoaded', renderOffers);