document.addEventListener("DOMContentLoaded", async () => {
  // 🔹 PRIMER PASO: Verificar si el usuario es admin
  try {
    const res = await fetch("https://foodie-rank-backend.onrender.com/usuarios/api/verificar-admin", {
      method: "GET",
      credentials: "include" // ⚠️ envía cookies httpOnly
    });

    if (!res.ok) {
      alert("No tienes permisos para acceder a esta página.");
      window.location.href = "../index.html"; // redirige si no es admin
      return;
    }

    const data = await res.json();
    console.log("Acceso concedido:", data.mensaje);

    // ✅ Inicializamos el dashboard
    iniciarAdminDashboard();

  } catch (error) {
    console.error("Error verificando admin:", error);
    window.location.href = "../index.html"; // redirige al login en caso de error
  }
});

// 🔹 SEGUNDO PASO: Función que carga el dashboard
function iniciarAdminDashboard() {
  const sidebarBtns = document.querySelectorAll(".sidebar .menu-btn");
  const perfilContent = document.querySelector(".perfil-content");
  let currentSection = null;

  // Endpoints
  const apiUrls = {
    "Mi perfil": "https://foodie-rank-backend.onrender.com/usuarios/logged/verificar",
    "Usuarios": "https://foodie-rank-backend.onrender.com/usuarios",
    "Restaurantes": "https://foodie-rank-backend.onrender.com/restaurantes",
    "Solicitudes": "https://foodie-rank-backend.onrender.com/solicitudes",
    "Categorias": "https://foodie-rank-backend.onrender.com/categorias"
  };

  function limpiarContenido() {
    perfilContent.innerHTML = "";
  }

  async function cargarEntidad(nombreEntidad) {
    limpiarContenido();
    currentSection = nombreEntidad;

    if (nombreEntidad === "Mi perfil") {
      await cargarPerfil();
      return;
    }

    const container = document.createElement("div");
    container.id = `${nombreEntidad.replace(/\s+/g, "")}Container`;
    container.classList.add("entity-container");

    let datos = [];
    if (apiUrls[nombreEntidad]) {
      try {
        const res = await fetch(apiUrls[nombreEntidad], { credentials: "include" });
        if (res.ok) datos = await res.json();
      } catch (err) {
        console.error(`Error cargando ${nombreEntidad}:`, err);
      }
    }

    datos.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("entity-card");

      if (nombreEntidad === "Usuarios") {
        div.innerHTML = `
          <p><strong>Nombre:</strong> ${item.nombre}</p>
          <p><strong>Email:</strong> ${item.correo}</p>
          <p><strong>Rol:</strong> ${item.rol}</p>
          <button class="delete-btn">Eliminar</button>
        `;
        div.querySelector(".delete-btn").addEventListener("click", async () => {
          await fetch(`${apiUrls["Usuarios"]}/${item._id}`, { method: "DELETE", credentials: "include" });
          div.remove();
        });

      } else if (nombreEntidad === "Restaurantes") {
        div.innerHTML = `
          <p><strong>Nombre:</strong> ${item.nombre}</p>
          <p><strong>Ubicación:</strong> ${item.ubicacion}</p>
          <p><strong>Categoria:</strong> ${item.categoria_info.nombre}</p>
          <p><strong>Descripcion:</strong> ${item.descripcion}</p>
          <img src="${item.imagen}" width="100" />
          <button class="delete-btn">Eliminar</button>
        `;
        div.querySelector(".delete-btn").addEventListener("click", async () => {
          await fetch(`${apiUrls["Restaurantes"]}/${item._id}`, { method: "DELETE", credentials: "include" });
          div.remove();
        });

      } else if (nombreEntidad === "Solicitudes") {
        div.innerHTML = `
          <p><strong>Nombre:</strong> ${item.nombre}</p>
          <p><strong>Ubicación:</strong> ${item.ubicacion}</p>
          <p><strong>Descripcion:</strong> ${item.descripcion}</p>
          <p><strong>Categoria:</strong> ${item.categoria.nombre}</p>
          <p><strong>Usuario:</strong> ${item.usuario.nombre}</p>
          <img src="${item.imagen}" width="100" />
          <button class="aprobar-btn">Aprobar</button>
          <button class="delete-btn">Eliminar</button>
        `;

        // Aprobar solicitud
        div.querySelector(".aprobar-btn").addEventListener("click", async () => {
          try {
            const res = await fetch(`${apiUrls["Solicitudes"]}/${item._id}/aceptar`, {
              method: "PATCH",
              credentials: "include"
            });
            if (!res.ok) throw new Error("Error al aceptar solicitud");
            div.remove();
            alert("Solicitud aprobada y convertida en restaurante");
          } catch (err) {
            console.error(err);
            alert("Error aprobando solicitud");
          }
        });

        // Rechazar solicitud
        div.querySelector(".delete-btn").addEventListener("click", async () => {
          try {
            const res = await fetch(`${apiUrls["Solicitudes"]}/${item._id}`, {
              method: "DELETE",
              credentials: "include"
            });
            if (!res.ok) throw new Error("Error al rechazar solicitud");
            div.remove();
            alert("Solicitud rechazada y eliminada");
          } catch (err) {
            console.error(err);
            alert("Error eliminando solicitud");
          }
        });

      } else if (nombreEntidad === "Categorias") {
        div.innerHTML = `
          <label>Nombre:</label>
          <input type="text" value="${item.nombre}" class="categoria-nombre" />
          <label>Descripcion:</label>
          <textarea class="categoria-desc">${item.descripcion}</textarea>
          <button class="update-categoria">Actualizar</button>
          <button class="delete-btn">Eliminar</button>
        `;
        div.querySelector(".update-categoria").addEventListener("click", async () => {
          const nombre = div.querySelector(".categoria-nombre").value;
          const descripcion = div.querySelector(".categoria-desc").value;
          await fetch(`${apiUrls["Categorias"]}/${item._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion }),
            credentials: "include"
          });
          alert("Categoría actualizada");
        });
        div.querySelector(".delete-btn").addEventListener("click", async () => {
          await fetch(`${apiUrls["Categorias"]}/${item._id}`, { method: "DELETE", credentials: "include" });
          div.remove();
        });
      }

      container.appendChild(div);
    });

    // Añadir botón para crear entidades
    if (nombreEntidad !== "Usuarios" && nombreEntidad !== "Solicitudes" && nombreEntidad !== "Restaurantes") {
      const addBtn = document.createElement("button");
      addBtn.textContent = `+ Añadir ${nombreEntidad}`;

      addBtn.addEventListener("click", async () => {
        addBtn.style.display = "none";
        const existingForm = container.querySelector(".add-entity-form");
        if (existingForm) existingForm.remove();

        const form = document.createElement("form");
        form.classList.add("add-entity-form");
        form.innerHTML = `
          <label>Nombre:</label>
          <input type="text" name="nombre" required />
          <label>Descripcion:</label>
          <textarea name="descripcion" required></textarea>
          <button type="submit">Crear</button>
          <button type="button" class="cancel-btn">Cancelar</button>
        `;

        form.querySelector(".cancel-btn").addEventListener("click", () => {
          form.remove();
          addBtn.style.display = "inline-block";
        });

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const nombre = form.nombre.value.trim();
          const descripcion = form.descripcion.value.trim();
          if (!nombre || !descripcion) return alert("Todos los campos son obligatorios");

          try {
            const res = await fetch(apiUrls["Categorias"], {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nombre, descripcion }),
              credentials: "include"
            });
            if (!res.ok) throw new Error("Error al crear la categoría");
            alert("Categoría creada correctamente");
            cargarEntidad("Categorias");
          } catch (err) {
            console.error(err);
            alert("Error creando categoría");
            addBtn.style.display = "inline-block";
          }
        });

        container.appendChild(form);
        container.appendChild(addBtn);
      });

      container.appendChild(addBtn);
    }

    perfilContent.appendChild(container);
  }

  async function cargarPerfil() {
    limpiarContenido();
    try {
      const res = await fetch(apiUrls["Mi perfil"], { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      const usuario = data.usuario;

      const container = document.createElement("div");
      container.classList.add("perfil-container-admin");
      container.innerHTML = `
      <img src="../images/user.png" style="max-width: 25vw;">
        <h2>${usuario.nombre}</h2>
        <p><strong>Correo:</strong> ${usuario.correo}</p>
        <p><strong>Rol:</strong> ${usuario.rol}</p>
        <button class="cerrar-sesion">Cerrar Sesión</button>
      `;
      perfilContent.appendChild(container);

      // 🔹 BOTÓN CERRAR SESIÓN
      const cerrarSesionBtn = container.querySelector(".cerrar-sesion");
      cerrarSesionBtn.addEventListener("click", async () => {
        try {
          await fetch("https://foodie-rank-backend.onrender.com/usuarios/logout", {
            method: "POST",
            credentials: "include",
          });

          document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie.split(";").forEach(c => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "../index.html";
        } catch (error) {
          console.error("Error cerrando sesión:", error);
        }
      });
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  }

  sidebarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const nombreEntidad = btn.textContent.trim();
      cargarEntidad(nombreEntidad);
    });
  });

  cargarEntidad("Mi perfil");
}
