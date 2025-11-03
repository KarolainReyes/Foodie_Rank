document.addEventListener('DOMContentLoaded', () => {
  const baseURL = 'https://foodie-rank-backend.onrender.com';

  const urls = {
    restaurantesUsuario: `${baseURL}/restaurantes/usuario/`,
    crearRestaurante: `${baseURL}/solicitudes/`,
    actualizarRestaurante: `${baseURL}/restaurantes/`,
    eliminarRestaurante: `${baseURL}/restaurantes/`,
    platosRestaurante: `${baseURL}/platos/restaurante/`,
    crearPlato: `${baseURL}/platos`,
    actualizarPlato: `${baseURL}/platos/`,
    eliminarPlato: `${baseURL}/platos/`,
    categorias: `${baseURL}/categorias`
  };

  const userRestaurants = document.getElementById('userRestaurants');
  const restaurantForm = document.getElementById('restaurantForm');
  const addRestaurantBtn = document.getElementById('addRestaurantBtn');
  const usuario = JSON.parse(localStorage.getItem('usuarioInfo'));
  if (!usuario || !usuario.id) return alert('Usuario no autenticado');

  let restaurantes = [];
  let platos = [];
  let restauranteActivo = null;
  let categorias = [];

  // ---------------- FETCH CATEGORIAS ----------------
  async function cargarCategorias() {
    try {
      const res = await fetch(urls.categorias, { credentials: 'include' });
      if (!res.ok) throw new Error('No se pudieron cargar las categorias');
      categorias = await res.json();
    } catch (err) {
      console.error(err);
      categorias = [];
    }
  }

  function llenarSelectCategoria(selectedId = '') {
    const select = document.getElementById('categoria');
    select.innerHTML = '';
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = cat.nombre;
      if (cat._id === selectedId) option.selected = true;
      select.appendChild(option);
    });
  }

  // ---------------- LISTA RESTAURANTES ----------------
  async function cargarRestaurantes() {
    const res = await fetch(urls.restaurantesUsuario + usuario.id, { credentials: 'include' });
    restaurantes = await res.json();

    userRestaurants.innerHTML = '';
    restaurantes.forEach((r, i) => {
      const div = document.createElement('div');
      div.classList.add('restaurant-card');
      if (i === 0) div.classList.add('active');
      div.innerHTML = `
        <img src="${r.imagen || 'https://via.placeholder.com/150'}" alt="${r.nombre}" />
        <div class="card-info"><h4>${r.nombre}</h4></div>
      `;
      div.addEventListener('click', () => seleccionarRestaurante(r));
      userRestaurants.appendChild(div);
    });

    if (restaurantes[0]) seleccionarRestaurante(restaurantes[0]);
  }

  // ---------------- FORM RESTAURANTE ----------------
  function seleccionarRestaurante(restaurante) {
    restauranteActivo = restaurante;

    // Activar visualmente
    document.querySelectorAll('.restaurant-card').forEach(c => c.classList.remove('active'));
    const cardActivo = Array.from(userRestaurants.children).find(c => c.querySelector('h4').textContent === restaurante.nombre);
    if (cardActivo) cardActivo.classList.add('active');

    // Llenar formulario
    document.getElementById('nombre').value = restaurante.nombre || '';
    document.getElementById('descripcion').value = restaurante.descripcion || '';
    document.getElementById('direccion').value = restaurante.ubicacion || '';
    document.getElementById('foto').value = restaurante.imagen || '';
    document.getElementById('previewImage').src = restaurante.imagen || '';

    llenarSelectCategoria(restaurante.categoria || '');
    cargarPlatos(restaurante._id);
  }

  // ---------------- ENVIAR FORM RESTAURANTE ----------------
  restaurantForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const direccion = document.getElementById('direccion').value;
    const imagen = document.getElementById('foto').value;
    const categoria = document.getElementById('categoria').value;

    if (!nombre || !descripcion || !direccion || !imagen || !categoria) {
      return alert('Completa todos los campos');
    }

    if (restauranteActivo) {
      await fetch(urls.actualizarRestaurante + restauranteActivo._id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, ubicacion: direccion, imagen, categoria }),
        credentials: 'include'
      });
    } else {
      await fetch(urls.crearRestaurante, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, ubicacion: direccion, imagen, categoria, usuario: usuario.id }),
        credentials: 'include'
      });
    }

    restauranteActivo = null;
    alert("Restaurante creado o actualizado correctamente");
    cargarRestaurantes();
  });

  // ---------------- NUEVO RESTAURANTE ----------------
  addRestaurantBtn.addEventListener('click', () => {
    restauranteActivo = null;

    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('foto').value = '';
    document.getElementById('previewImage').src = '';

    platosContainer.innerHTML = '';
    llenarSelectCategoria();
  });

  // ---------------- PLATOS ----------------
  const platosContainer = document.createElement('div');
  platosContainer.id = 'platosContainer';
  restaurantForm.parentNode.appendChild(platosContainer);

  async function cargarPlatos(restauranteId) {
    const res = await fetch(urls.platosRestaurante + restauranteId, { credentials: 'include' });
    platos = await res.json();

    platosContainer.innerHTML = '';
    platos.forEach(plato => {
      const div = document.createElement('div');
      div.classList.add('plato-card');
      div.innerHTML = `
        <label>Nombre:</label>
        <input type="text" value="${plato.nombre}" class="plato-nombre" placeholder="Nombre del plato"/>
        <label>Descripcion:</label>
        <textarea rows="2" class="plato-desc" placeholder="Descripción del plato">${plato.descripcion}</textarea>
        <label>Precio:</label>
        <input type="text" value="${plato.precio}" class="plato-precio" placeholder="Precio"/>
        <label>Imagen:</label>
        <img src="${plato.imagen}" width="100px" style="display:block;"/>
        <input type="url" value="${plato.imagen}" class="plato-imagen" placeholder="URL de imagen"/>
        <button class="update-plato">Actualizar</button>
        <button class="delete-plato">Eliminar</button>
      `;
      platosContainer.appendChild(div);

      // Actualizar plato
      div.querySelector('.update-plato').addEventListener('click', async () => {
        const nombre = div.querySelector('.plato-nombre').value;
        const descripcion = div.querySelector('.plato-desc').value;
        const precio = div.querySelector('.plato-precio').value;
        const imagen = div.querySelector('.plato-imagen').value;

        await fetch(urls.actualizarPlato + plato._id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, descripcion, precio, imagen }),
          credentials: 'include'
        });

        cargarPlatos(restauranteId);
      });

      // Eliminar plato
      div.querySelector('.delete-plato').addEventListener('click', async () => {
        if (!confirm('Eliminar este plato?')) return;
        await fetch(urls.eliminarPlato + plato._id, { method: 'DELETE', credentials: 'include' });
        cargarPlatos(restauranteId);
      });
    });

    // ---------------- CREAR NUEVO PLATO ----------------
    const nuevoBtn = document.createElement('button');
    nuevoBtn.textContent = '+ Crear nuevo plato';
    nuevoBtn.classList.add("crear-plato")
    nuevoBtn.type = 'button';
    nuevoBtn.addEventListener('click', () => {
      if (!restauranteActivo) return alert('Selecciona un restaurante');
      if (document.querySelector('.add-plato-form')) return;

      const form = document.createElement('form');
      form.classList.add('add-plato-form');
      form.innerHTML = `
        <label>Nombre:</label>
        <input type="text" name="nombre" placeholder="Nombre del plato" required/>
        <label>Descripcion:</label>
        <textarea name="descripcion" placeholder="Descripcion del plato" required></textarea>
        <label>Precio:</label>
        <input type="text" name="precio" placeholder="Precio" required/>
        <label>Imagen (URL):</label>
        <input type="url" name="imagen" placeholder="URL de la imagen" required/>
        <button type="submit">Crear</button>
        <button type="button" class="cancel-btn">Cancelar</button>
      `;

      form.querySelector('.cancel-btn').addEventListener('click', () => form.remove());

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = form.nombre.value.trim();
        const descripcion = form.descripcion.value.trim();
        const precio = form.precio.value.trim();
        const imagen = form.imagen.value.trim();
        if (!nombre || !descripcion || !precio || !imagen) return alert('Todos los campos son obligatorios');

        try {
          await fetch(urls.crearPlato, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion, precio, imagen, restaurante: restauranteActivo._id }),
            credentials: 'include'
          });
          form.remove();
          cargarPlatos(restauranteActivo._id);
        } catch (err) {
          console.error('Error creando plato:', err);
          alert('Error creando plato');
        }
      });

      platosContainer.appendChild(form);
    });

    platosContainer.appendChild(nuevoBtn);
  }

  // ---------------- INICIAL ----------------
  (async () => {
    await cargarCategorias();
    cargarRestaurantes();
  })();
});
