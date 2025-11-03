document.addEventListener("DOMContentLoaded", async () => {
  const navbar = document.querySelector(".navita");

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
    newButton.classList.add("boton-dinamico");

    if (usuario.rol === "Admin") {
      newButton.textContent = "Gestión";
      newButton.addEventListener("click", () => {
        window.location.href = "https://karolainreyes.github.io/Foodie_Rank/html/admin.html";
      });
    } else {
      newButton.textContent = "Mi perfil";
      newButton.addEventListener("click", () => {
        window.location.href = "https://karolainreyes.github.io/Foodie_Rank/html/perfil_user.html";
      });
    }

    navbar.appendChild(newButton);

  } catch (err) {
    console.error("Error verificando usuario:", err);
  }
});
