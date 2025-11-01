document.addEventListener('DOMContentLoaded', () => {
  const baseURL = 'http://localhost:4000';

  const urls = {
    restaurantesUsuario: `${baseURL}/restaurantes/usuario/`,
    crearRestaurante: `${baseURL}/solicitudes/`,
    actualizarRestaurante: `${baseURL}/restaurantes/`,
    eliminarRestaurante: `${baseURL}/restaurantes/`,
    platosRestaurante: `${baseURL}/platos/restaurante/`,
    crearPlato: `${baseURL}/platos`,
    actualizarPlato: `${baseURL}/platos/`,
    eliminarPlato: `${baseURL}/platos/`,
  };

  const userRestaurants = document.getElementById('userRestaurants');
  const restaurantForm = document.getElementById('restaurantForm');
  const addRestaurantBtn = document.getElementById('addRestaurantBtn');

  const usuario = JSON.parse(localStorage.getItem('usuarioInfo'));
  if (!usuario || !usuario.id) return alert('Usuario no autenticado');

  let restaurantes = [];
  let platos = [];
  let restauranteActivo = null;

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
    document.getElementById('previewImage').value = restaurante.imagen || '';
    
    cargarPlatos(restaurante._id);
  }

  // Enviar formulario
restaurantForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const direccion = document.getElementById('direccion').value;
  const imagen = document.getElementById('foto').value;

  if (!nombre || !descripcion || !direccion || !imagen) {
    return alert('Completa todos los campos');
  }

  if (restauranteActivo) {
    // Si hay restaurante activo → actualizar
    await fetch(urls.actualizarRestaurante + restauranteActivo._id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, ubicacion: direccion, imagen }),
      credentials: 'include'
    });
  } else {
    // Si no hay restaurante activo → crear nuevo
    await fetch(urls.crearRestaurante, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        descripcion,
        ubicacion: direccion,
        imagen,
        usuario: usuario.id
      }),
      credentials: 'include'
    });
  }
 
  // Recargar lista y limpiar selección
  restauranteActivo = null;
  alert("Restaurante creado o actualizado correctamente")
  cargarRestaurantes();
});


  // Crear nuevo restaurante
addRestaurantBtn.addEventListener('click', () => {
  restauranteActivo = null;

  // Limpiar formulario
  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('foto').value = '';
  document.getElementById('previewImage').value = '';

  // Limpiar platos
  platosContainer.innerHTML = '';
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
       <label for="nombre">Nombre:</label>
        <input type="text" value="${plato.nombre}" class="plato-nombre" placeholder="Nombre del plato"/>
        <label for="descripcion">Descripcion:</label>
        <textarea rows="2" class="plato-desc" placeholder="Descripción del plato">${plato.descripcion}</textarea>
        <label for="precio">Precio:</label>
                <input type="text" value="${plato.precio}" class="plato-nombre" placeholder="Precio"/>
<label for="imagen">Imagen:</label>
        <img src="${plato.imagen}" width=100px style="display: block;">
                        
        <input type="url" value="${plato.imagen}" class="plato-imagen" placeholder="URL de imagen"/>

        <button class="update-plato">Actualizar</button>
        <button class="delete-plato">Eliminar</button>
      `;
      platosContainer.appendChild(div);

      div.querySelector('.update-plato').addEventListener('click', async () => {
        const nombre = div.querySelector('.plato-nombre').value;
        const descripcion = div.querySelector('.plato-desc').value;
        const imagen = div.querySelector('.plato-imagen').value;

        await fetch(urls.actualizarPlato + plato._id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, descripcion, imagen }),
          credentials: 'include'
        });

        cargarPlatos(restauranteId);
      });

      div.querySelector('.delete-plato').addEventListener('click', async () => {
        if (!confirm('Eliminar este plato?')) return;
        await fetch(urls.eliminarPlato + plato._id, { method: 'DELETE', credentials: 'include' });
        cargarPlatos(restauranteId);
      });
    });

    // Crear nuevo plato
    const nuevoBtn = document.createElement('button');
    nuevoBtn.textContent = '+ Crear nuevo plato';
    nuevoBtn.addEventListener('click', async () => {
      if (!restauranteActivo) return alert('Selecciona un restaurante');
      const nombre = prompt('Nombre del plato');
      const descripcion = prompt('Descripción del plato');
      const imagen = prompt('URL de la imagen del plato');
      if (!nombre || !descripcion || !imagen) return;

      await fetch(urls.crearPlato, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, imagen, restaurante: restauranteActivo._id }),
        credentials: 'include'
      });

      cargarPlatos(restauranteActivo._id);
    });
    platosContainer.appendChild(nuevoBtn);
  }

  // ---------------- INICIAL ----------------
  cargarRestaurantes();
});
