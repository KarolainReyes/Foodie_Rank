document.addEventListener('DOMContentLoaded', () => {

  const baseURL = 'http://localhost:4000';

  const urls = {
    me: `${baseURL}/usuarios/logged/verificar`,      // GET → info del usuario logueado
    updateUser: `${baseURL}/usuarios/`,             // PATCH → actualizar usuario (append id)
    userReseñas: `${baseURL}/resenias/`,      // GET → reseñas por userId
    createReseña: `${baseURL}/resenias`,           // POST → crear reseña
    updateReseña: `${baseURL}/resenias/`,          // PATCH → actualizar reseña (append id)
    deleteReseña: `${baseURL}/resenias/`,          // DELETE → eliminar reseña (append id)
    restaurantes: `${baseURL}/restaurantes`,       // GET → listar restaurantes
    restaurantesPage: '/restaurantes.html'         // Redirección
  };

  // BOTONES
  const perfilBtn = document.querySelectorAll('.menu-btn')[0];
  const reseñasBtn = document.querySelectorAll('.menu-btn')[1];
  const restaurantesBtn = document.querySelectorAll('.menu-btn')[2];

  const perfilSection = document.getElementById('perfil-section');
  const reseñasSection = document.getElementById('reseñas-section');

  function mostrarSeccion(seccion) {
    perfilSection.classList.add('hidden');
    reseñasSection.classList.add('hidden');
    seccion.classList.remove('hidden');
  }

  perfilBtn.addEventListener('click', () => {
    mostrarSeccion(perfilSection);
    cargarPerfil();
  });

  reseñasBtn.addEventListener('click', () => {
    mostrarSeccion(reseñasSection);
    cargarReseñas();
  });

  restaurantesBtn.addEventListener('click', () => {
    window.location.href = urls.restaurantesPage;
  });

  // ---------------- PERFIL ----------------
  async function cargarPerfil() {
    try {
      const res = await fetch(urls.me, { credentials: 'include' }); // GET
      if (!res.ok) throw new Error('No autorizado');
      const data = await res.json();
      const user = data.usuario;

      const userContainer = document.getElementById('userContainer');
      userContainer.innerHTML = `
        <form id="perfilForm" class="perfil-form">
          <label>Nombre</label>
          <input type="text" name="nombre" value="${user.nombre}" />
          <label>Correo</label>
          <input type="email" name="correo" value="${user.correo}" />
          <button type="submit" id="saveBtn">Guardar cambios</button>
        </form>
      `;

      document.getElementById('perfilForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dataUpdate = {
          nombre: formData.get('nombre'),
          correo: formData.get('correo')
        };

        const resUpdate = await fetch(urls.updateUser + user._id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataUpdate),
          credentials: 'include'
        });
        if (resUpdate.ok) alert('Perfil actualizado!');
        else alert('Error al actualizar perfil');
      });

    } catch (err) {
      console.error(err);
    }
  }

  // ---------------- RESEÑAS ----------------
  async function cargarReseñas() {
    try {
      const meRes = await fetch(urls.me, { credentials: 'include' });
      if (!meRes.ok) throw new Error('No autorizado');
      const data = await meRes.json();
      const user = data.usuario;
      console.log(user._id)
      const resReseñas = await fetch(urls.userReseñas + user._id, { credentials: 'include' });
       // GET
      const reseñas = await resReseñas.json();

      const container = document.getElementById('reseñasContainer');
      container.innerHTML = '';

      reseñas.forEach(r => {
        const div = document.createElement('div');
        div.classList.add('reseña-card');
        div.innerHTML = `
          <h4>Calificación: ${r.calificacion}</h4>
          <p>${r.comentario}</p>
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        `;
        container.appendChild(div);

        // Editar reseña → PATCH
        div.querySelector('.edit-btn').addEventListener('click', async () => {
          const nuevoComentario = prompt('Editar comentario:', r.comentario);
          const nuevaCalificacion = prompt('Editar calificación (1-5):', r.calificacion);
          if (!nuevoComentario || !nuevaCalificacion) return;

          await fetch(urls.updateReseña + r._id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              comentario: nuevoComentario,
              calificacion: parseFloat(nuevaCalificacion)
            }),
            credentials: 'include'
          });
          cargarReseñas();
        });

        // Eliminar reseña → DELETE
        div.querySelector('.delete-btn').addEventListener('click', async () => {
          if (!confirm('¿Seguro que deseas eliminar esta reseña?')) return;
          await fetch(urls.deleteReseña + r._id, { method: 'DELETE', credentials: 'include' });
          cargarReseñas();
        });
      });

      // Crear nueva reseña
      const crearBtn = document.createElement('button');
      crearBtn.textContent = 'Crear nueva reseña';
      crearBtn.addEventListener('click', crearReseñaForm);
      container.appendChild(crearBtn);

    } catch (err) {
      console.error(err);
    }
  }

  // ---------------- CREAR NUEVA RESEÑA ----------------
  async function crearReseñaForm() {
    try {
      const res = await fetch(urls.restaurantes, { credentials: 'include' });
      const restaurantes = await res.json();

      const container = document.getElementById('reseñasContainer');
      container.innerHTML = '';

      const form = document.createElement('form');
      form.classList.add('perfil-form');
      form.innerHTML = `
        <label>Restaurante</label>
        <select name="restaurante">
          ${restaurantes.map(r => `<option value="${r._id}">${r.nombre}</option>`).join('')}
        </select>
        <label>Calificación</label>
        <input type="number" name="calificacion" min="1" max="5" step="0.1"/>
        <label>Comentario</label>
        <input type="text" name="comentario"/>
        <button type="submit">Crear reseña</button>
      `;
      container.appendChild(form);

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const dataForm = Object.fromEntries(new FormData(form));
        const meRes = await fetch(urls.me, { credentials: 'include' });
        const dataUser = await meRes.json();
        dataForm.usuario = dataUser.usuario._id;

        await fetch(urls.createReseña, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataForm),
          credentials: 'include'
        });
        cargarReseñas();
      });

    } catch (err) {
      console.error(err);
    }
  }

});
