document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navita ul");
  const loginOverlay = document.getElementById("modal-overlay");
  const loginForm = document.getElementById("login-form");

  if (!navbar || !loginOverlay || !loginForm) return;

  // Crear botón de login si no existe
  let loginBtn = document.getElementById("login-btn");
  if (!loginBtn) {
    loginBtn = document.createElement("button");
    loginBtn.id = "login-btn";
    loginBtn.textContent = "Ingresar";
    navbar.insertAdjacentElement("afterend",loginBtn)
  }

  // Mostrar modal
  loginBtn.addEventListener("click", () => {
    loginOverlay.style.display = "flex";
  });

  // Cerrar modal
  loginOverlay.addEventListener("click", (e) => {
    if (e.target === loginOverlay) loginOverlay.style.display = "none";
  });

  // Guardar usuario en localStorage
  function guardarUsuarioLocalStorage(usuario) {
    const usuarioLocale = { id: usuario._id, nombre: usuario.nombre,correo:usuario.correo};
    localStorage.setItem("usuarioInfo", JSON.stringify(usuarioLocale));
    console.log("ID del usuario:", usuarioLocale.id);
    console.log("Nombre del usuario:", usuarioLocale.nombre);
  }

  // Envío del formulario
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailUser = loginForm.querySelector('input[type="email"]').value.trim();
    const contraseniaUser = loginForm.querySelector('input[type="password"]').value.trim();
    if (!emailUser || !contraseniaUser) return alert("Por favor ingresa tu correo y contraseña.");

    try {
      const response = await fetch("http://localhost:4000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ emailUser, contraseniaUser }),
      });

      const data = await response.json();

      if (response.ok && data.exito) {
        guardarUsuarioLocalStorage(data.usuario);
        alert(`¡Bienvenido/a ${data.usuario.nombre}!`);
        loginOverlay.style.display = "none";
          location.reload();
      } else {
        alert(data.mensaje || "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  });

    // ==========================
  // Registro
  // ==========================
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombreUser = registerForm.querySelector('input[name="nombre"]').value.trim();
    const emailUser = registerForm.querySelector('input[type="email"]').value.trim();
    const contraseniaUser = registerForm.querySelector('input[type="password"]').value.trim();

    // Validaciones frontend
    if (!nombreUser || !emailUser || !contraseniaUser) return alert("Por favor completa todos los campos.");
    if (nombreUser.length < 3) return alert("El nombre debe tener al menos 3 caracteres.");
    if (contraseniaUser.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");

    try {
      const response = await fetch("http://localhost:4000/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nombre: nombreUser, correo: emailUser, contraseña: contraseniaUser }),
      });

      const data = await response.json();

      if (data.exito) {
        alert(`¡Usuario ${data.usuario.nombre} registrado correctamente!`);
        registerOverlay.style.display = "none";
        location.reload();
      } else {
        alert(data.error || "No se pudo registrar el usuario");
      }

    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  });
});
