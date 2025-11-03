document.addEventListener("DOMContentLoaded", async () => {
  const navbar = document.querySelector(".navita");
  const currentPage = window.location.pathname.split("/").pop(); 

  try {
    const response = await fetch("https://foodie-rank-backend.onrender.com/usuarios/logged/verificar", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) return;

    const data = await response.json();
    const usuario = data.usuario;
    if (!usuario) return;

    const oldBtn = navbar.querySelector("#login-btn");
    if (oldBtn) oldBtn.remove();

    let newButton = document.createElement("button");
    if (usuario.rol === "Admin") {
      newButton.textContent = "Gestión";
      newButton.classList.add("boton-dinamico")
      // Redirigir correctamente desde cualquier página
      newButton.addEventListener("click", () => {
        window.location.href = currentPage === "index.html" ? "./html/admin.html" : "../html/admin.html";
      });
    } else {
      newButton.textContent = "Mi perfil";
      newButton.classList.add("boton-dinamico")
      newButton.addEventListener("click", () => {
        window.location.href = currentPage === "index.html" ? "./html/perfil_user.html" : "../html/perfil_user.html";
      });
    }

    navbar.appendChild(newButton);

  } catch (err) {
    console.error("Error verificando usuario:", err);
  }
});
