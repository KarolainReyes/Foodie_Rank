document.addEventListener("DOMContentLoaded", async () => {
  const navbar = document.querySelector(".navbar");

  try {
    const response = await fetch("http://localhost:4000/usuarios/logged/verificar", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) return; // No hace nada si no hay usuario

    const data = await response.json();
    const usuario = data.usuario;
    if (!usuario) return;

    // Eliminar botón de login y crear botón según rol
    const oldBtn = navbar.querySelector("#login-btn");
    if (oldBtn) oldBtn.remove();

    let newButton;
    if (usuario.rol === "Admin") {
      newButton = document.createElement("button");
      newButton.textContent = "Gestión";
      newButton.addEventListener("click", () => {
        window.location.href = "./html/admin.html";
      });
    } else {
      newButton = document.createElement("button");
      newButton.textContent = "Mi perfil";
      newButton.addEventListener("click", () => {
        window.location.href = "./html/perfil.html";
      });
    }

    navbar.appendChild(newButton);
  } catch (err) {
    console.error("Error verificando usuario:", err);
  }
});
