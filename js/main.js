document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const modalOverlay = document.getElementById("modal-overlay");
  const loginForm = document.getElementById("login-form");

  // --- FUNCIONES AUXILIARES ---

  // Mostrar botón según rol
  function renderBotonPorRol(usuario) {
    // Elimina cualquier botón previo
    const oldBtn = navbar.querySelector("button");
    if (oldBtn) oldBtn.remove();

    let newButton;

    if (!usuario || !usuario.rol) {
      // Usuario no autenticado
      newButton = document.createElement("button");
      newButton.id = "login-btn";
      newButton.textContent = "Log In";
      newButton.addEventListener("click", () => {
        modalOverlay.style.display = "flex";
      });
    } else if (usuario.rol === "Admin") {
      // Usuario administrador
      newButton = document.createElement("button");
      newButton.id = "admin-btn";
      newButton.textContent = "Gestión";
      newButton.addEventListener("click", () => {
        window.location.href = "./html/admin.html";
      });
    } else {
      // Usuario normal
      newButton = document.createElement("button");
      newButton.id = "user-btn";
      newButton.textContent = "Mi perfil";
      newButton.addEventListener("click", () => {
        window.location.href = "./html/perfil.html";
      });
    }

    navbar.appendChild(newButton);
  }

  // --- VERIFICAR TOKEN EN COOKIE AL CARGAR ---
  async function verificarSesion() {
    try {
      const response = await fetch("http://localhost:4000/usuarios/logged/verificar", {
        method: "GET",
        credentials: "include", // Enviar cookies automáticamente
      });

      if (!response.ok) {
        renderBotonPorRol(null); // No autenticado
        return;
      }

      const data = await response.json();
      renderBotonPorRol(data.usuario);
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      renderBotonPorRol(null);
    }
  }

  // --- EVENTOS DE MODAL DE LOGIN ---
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });

  // --- ENVÍO DEL FORMULARIO DE LOGIN ---
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailUser = loginForm.querySelector('input[type="email"]').value.trim();
    const contraseniaUser = loginForm.querySelector('input[type="password"]').value.trim();

    if (!emailUser || !contraseniaUser) {
      alert("Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 importante para que se guarde la cookie
        body: JSON.stringify({ emailUser, contraseniaUser }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`¡Bienvenido/a ${data.usuario.nombre}!`);
        modalOverlay.style.display = "none";
        renderBotonPorRol(data.usuario);
      } else {
        alert(data.message || "Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  });

  // --- INICIAR ---
  verificarSesion(); // Verifica token al cargar la página
});
