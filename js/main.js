document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const modalOverlay = document.getElementById("modal-overlay");

  // Mostrar modal
  loginBtn.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
  });

  // Cerrar modal al hacer clic fuera del cuadro
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });
});
