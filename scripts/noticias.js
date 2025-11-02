document.addEventListener('DOMContentLoaded', async () => {
  const hero = document.getElementById('noticias-hero');
  const grid = document.getElementById('noticias-grid');
  if (!hero && !grid) return;

  const isTemplates = window.location.pathname.includes('/templates/');
  const base = isTemplates ? '../' : '';
  const resolveImg = (p) => {
    if (isTemplates) return p.startsWith('../') ? p : `../${p}`;
    return p.replace(/^\.\.\//, '');
  };

  try {
    const res = await fetch(`${base}data/noticias.json`);
    if (!res.ok) throw new Error('No se pudo cargar noticias.json');
    const data = await res.json();
    const items = data.noticias || [];

    const destacado = items[0];
    const chips = items.slice(0, 4).map(n => `<span class="noticias-chip">${n.titulo}</span>`).join('');

    const heroBg = isTemplates
      ? (destacado ? resolveImg(destacado.imagen) : `${base}imagenes/imagen_ado_fondo.png`)
      : `${base}imagenes/ado_kyogen.jpg`;
    const noticiasHref = isTemplates ? 'ado_noticias.html' : 'templates/ado_noticias.html';

    if (hero) {
      const positionStyle = isTemplates ? '' : 'background-position: center 30%;';
      hero.innerHTML = `
        <div class="noticias-hero" style="background-image: url('${heroBg}'); ${positionStyle}">
          <div class="noticias-hero-overlay">
            <h2 class="noticias-hero-title">Noticias de Ado</h2>
            <div class="noticias-hero-chips">${chips}</div>
            <a href="${noticiasHref}" class="btn btn-primary mt-3">Ver todas</a>
          </div>
        </div>
      `;
    }

    if (grid) {
      grid.innerHTML = '';
      items.forEach(n => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        const verMas = isTemplates
          ? `<button type="button" class="btn btn-sm btn-primary ver-mas-btn" data-id="${n.id}">Ver más</button>`
          : `<a href="${noticiasHref}" class="btn btn-sm btn-primary">Ver más</a>`;
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${resolveImg(n.imagen)}" class="card-img-top" alt="${n.titulo || ''}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${n.titulo || 'Noticia'}</h5>
              <p class="card-text">${n.resumen || ''}</p>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <span class="badge bg-info">${n.etiqueta || ''}</span>
                ${verMas}
              </div>
            </div>
          </div>
        `;
        grid.appendChild(col);
      });
    }

    if (isTemplates) {
      const modalEl = document.getElementById('modalNoticia');
      if (modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        document.querySelectorAll('.ver-mas-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = items.find(i => i.id === id);
            if (!item) return;
            const titleEl = document.getElementById('modalNoticiaLabel');
            const imgEl = document.getElementById('modalNoticiaImg');
            const contentEl = document.getElementById('modalNoticiaContenido');
            if (titleEl) titleEl.textContent = item.titulo || 'Noticia';
            if (imgEl) {
              imgEl.src = resolveImg(item.imagen);
              imgEl.alt = item.titulo || '';
            }
            if (contentEl) contentEl.textContent = item.contenido || item.resumen || '';
            modal.show();
          });
        });
      }

      // Rotación de imágenes con fundido y pausa en hover (cada ~4.5s)
      const heroDiv = hero ? hero.querySelector('.noticias-hero') : null;
      const images = items.map(i => resolveImg(i.imagen)).filter(Boolean);
      if (heroDiv && images.length > 1) {
        let idx = 0;
        let rotationTimer = null;
        const startRotation = () => {
          rotationTimer = setInterval(() => {
            heroDiv.style.opacity = '0';
            setTimeout(() => {
              idx = (idx + 1) % images.length;
              heroDiv.style.backgroundImage = `url('${images[idx]}')`;
              heroDiv.style.opacity = '1';
            }, 300);
          }, 4500);
        };
        const stopRotation = () => {
          if (rotationTimer) {
            clearInterval(rotationTimer);
            rotationTimer = null;
          }
        };

        startRotation();
        heroDiv.addEventListener('mouseenter', stopRotation);
        heroDiv.addEventListener('mouseleave', () => {
          if (!rotationTimer) startRotation();
        });
      }
    }
  } catch (err) {
    console.error(err);
    hero.innerHTML = '<div class="alert alert-warning">No se pudieron cargar las noticias.</div>';
  }
});