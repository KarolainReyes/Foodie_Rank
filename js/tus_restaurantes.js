// ===== MODAL NUEVO RESTAURANTE =====
const modal = document.getElementById("modalAgregar");
const addBtn = document.getElementById("addRestaurantBtn");
const closeBtn = document.getElementById("closeModal");
const nuevoForm = document.getElementById("nuevoRestauranteForm");
const nuevoFoto = document.getElementById("nuevoFoto");
const previewNuevo = document.getElementById("previewNuevo");

// Abrir modal
addBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

// Cerrar modal
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

// Vista previa imagen
nuevoFoto.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewNuevo.src = ev.target.result;
      previewNuevo.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Enviar formulario (simulado)
nuevoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Restaurante registrado exitosamente ✅");
  modal.classList.remove("active");
  nuevoForm.reset();
  previewNuevo.style.display = "none";
});
