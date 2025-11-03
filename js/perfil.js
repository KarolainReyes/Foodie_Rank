document.addEventListener('DOMContentLoaded', () => {

  const baseURL = 'https://foodie-rank-backend.onrender.com';

  const urls = {
    updateUser: `${baseURL}/usuarios/`,            
    userReseñas: `${baseURL}/resenias/user/`,           
    createReseña: `${baseURL}/resenias`,           
    updateReseña: `${baseURL}/resenias/`,          
    deleteReseña: `${baseURL}/resenias/`,          
    restaurantes: `${baseURL}/restaurantes`,       
    restaurantesPage: './tus_restaurantes.html'         
  };

  // BOTONES
  const perfilBtn = document.querySelectorAll('.menu-btn')[0];
  const reseñasBtn = document.querySelectorAll('.menu-btn')[1];
  const restaurantesBtn = document.querySelectorAll('.menu-btn')[2];
  const cerrarSesionBtn = document.querySelector('.cerrar-sesion');

  const perfilSection = document.getElementById('perfil-section');
  const reseñasSection = document.getElementById('reseñas-section');

  function mostrarSeccion(seccion) {
    perfilSection.classList.remove('active');
    reseñasSection.classList.remove('active');
    seccion.classList.add('active');
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
      const usuario = JSON.parse(localStorage.getItem("usuarioInfo"));
      if (!usuario || !usuario.id) throw new Error("Usuario no autenticado");

      const userContainer = document.getElementById('userContainer');
      userContainer.innerHTML = `
        <form id="perfilForm" class="perfil-form">
          <label>Nombre</label>
          <input type="text" name="nombre" value="${usuario.nombre || ''}" />
          <label>Correo</label>
          <input type="email" name="correo" value="${usuario.correo || ''}" />
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

        const resUpdate = await fetch(urls.updateUser + usuario.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataUpdate),
          credentials: 'include'
        });

        if (resUpdate.ok) {
          alert('Perfil actualizado!');
          // Actualizar localStorage
          usuario.nombre = dataUpdate.nombre;
          usuario.correo = dataUpdate.correo;
          localStorage.setItem("usuarioInfo", JSON.stringify(usuario));
        } else {
          alert('Error al actualizar perfil');
        }
      });

    } catch (err) {
      console.error(err);
    }
  }

  // ---------------- RESEÑAS ----------------
  async function cargarReseñas() {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioInfo"));
      if (!usuario || !usuario.id) throw new Error("Usuario no autenticado");

      const userId = usuario.id;
      console.log("ID del usuario desde localStorage:", userId);

      const resReseñas = await fetch(urls.userReseñas + userId, { credentials: 'include' });
      if (!resReseñas.ok) throw new Error("Error al obtener reseñas");
      const reseñas = await resReseñas.json();

      const container = document.getElementById('reseñasContainer');
      container.innerHTML = '';

      reseñas.forEach(r => {
        const div = document.createElement('div');
        div.classList.add('reseña-card');
        console.log(reseñas[0])
        const nombreRestaurante = r.restaurante_info.nombre 
          ? r.restaurante_info.nombre
          : "Desconocido";

        div.innerHTML = `
          <h4>Restaurante: ${nombreRestaurante}</h4>
          <h4>Calificación: ${r.calificacion}</h4>
          <p>${r.comentario}</p>
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        `;
        container.appendChild(div);

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

        div.querySelector('.delete-btn').addEventListener('click', async () => {
          if (!confirm('¿Seguro que deseas eliminar esta reseña?')) return;
          await fetch(urls.deleteReseña + r._id, { method: 'DELETE', credentials: 'include' });
          cargarReseñas();
        });
      });

      const crearBtn = document.createElement('button');
      crearBtn.textContent = 'Crear nueva reseña';
      crearBtn.classList.add("reseña-crear");
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

        const usuario = JSON.parse(localStorage.getItem("usuarioInfo"));
        if (!usuario || !usuario.id) throw new Error("Usuario no autenticado");

        dataForm.usuario = usuario.id;

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

  // ---------------- CERRAR SESIÓN ----------------
  cerrarSesionBtn.addEventListener('click', async () => {
    try {
      await fetch(`${baseURL}/usuarios/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // Eliminar cookies manualmente
      document.cookie.split(";").forEach(c => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Limpiar almacenamiento local y de sesión
      localStorage.clear();
      sessionStorage.clear();

      // Redirigir al inicio
      window.location.href = "../index.html";
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  });

  // --- CARGA INICIAL ---
  mostrarSeccion(perfilSection);
  cargarPerfil();

});
