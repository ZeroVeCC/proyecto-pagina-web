document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('#merchan-productos .row.g-4');
  if (!grid) return;

  try {
    const res = await fetch('../data/merchan.json');
    if (!res.ok) throw new Error('No se pudo cargar merchan.json');
    const data = await res.json();

    grid.innerHTML = '';
    data.productos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-lg-4';
      col.innerHTML = `
        <div class="card h-100 shadow-sm" data-id="${p.id}">
          <img src="${p.image}" class="card-img-top" alt="${p.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text">${p.description}</p>
            <span class="badge bg-success mb-2 align-self-start">${p.estado}</span>
            <span class="precio mb-2">$${p.precio.toLocaleString('es-AR')}</span>
            <a href="#" class="btn btn-primary mt-auto">Ver más</a>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    const alert = document.createElement('div');
    alert.className = 'alert alert-warning';
    alert.textContent = 'No se pudieron cargar los productos. Intenta nuevamente más tarde.';
    grid.parentElement.insertBefore(alert, grid);
  }
});