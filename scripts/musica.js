document.addEventListener('DOMContentLoaded', async () => {
  const listContainer = document.querySelector('#musica-albums .list-unstyled');
  if (!listContainer) return;

  try {
    const res = await fetch('../data/musica.json');
    if (!res.ok) throw new Error('No se pudo cargar musica.json');
    const data = await res.json();

    listContainer.innerHTML = '';
    data.albums.forEach(album => {
      const li = document.createElement('li');
      li.className = 'mb-4';
      li.innerHTML = `
        <div class="row align-items-center album-card-transparent p-3 rounded" data-id="${album.id}">
          <div class="col-3 col-md-2">
            <img src="${album.image}" alt="${album.title}" class="img-fluid rounded">
          </div>
          <div class="col-9 col-md-10">
            <span class="album-artist d-block mb-1">${album.artist}</span>
            <h3 class="album-title mb-2">${album.title}</h3>
            <div class="album-info mb-2">
              <span class="album-reviews ms-2">${album.description}</span>
            </div>
            <div class="album-price mb-2">
              <span class="fw-bold">${album.currency}${album.price.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      `;
      listContainer.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    const alert = document.createElement('div');
    alert.className = 'alert alert-warning';
    alert.textContent = 'No se pudieron cargar los álbumes. Intenta nuevamente más tarde.';
    listContainer.parentElement.insertBefore(alert, listContainer);
  }
});