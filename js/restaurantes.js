const container = document.getElementById("restaurantsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const rankingFilter = document.getElementById("rankingFilter");

const modalOverlay = document.getElementById("detail-modal-overlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const detailName = document.getElementById("detailName");
const detailImage = document.getElementById("detailImage");
const detailDescription = document.getElementById("detailDescription");
const detailLocation = document.getElementById("detailLocation");
const detailStars = document.getElementById("detailStars");
const detailScore = document.getElementById("detailScore");
const reviewsList = document.getElementById("reviewsList");

let listaRestaurantes = [];
let listaReseñas = [];

document.addEventListener("DOMContentLoaded", async () => {
  await obtenerRestaurantes();
  await obtenerReseñas();
  llenarCategorias();
  renderRestaurants(listaRestaurantes);

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  rankingFilter.addEventListener("change", applyFilters);
});

async function obtenerRestaurantes() {
  try {
    const res = await fetch("https://foodie-rank-backend.onrender.com/restaurantes");
    listaRestaurantes = await res.json();
  } catch (err) {
    console.error("Error al obtener restaurantes:", err);
  }
}

async function obtenerReseñas() {
  try {
    const res = await fetch("https://foodie-rank-backend.onrender.com/resenias");
    listaReseñas = await res.json();
  } catch (err) {
    console.error("Error al obtener reseñas:", err);
  }
}

async function llenarCategorias() {
  try {
    const res = await fetch("https://foodie-rank-backend.onrender.com/categorias");
    const categorias = await res.json();
    categoryFilter.innerHTML = `<option value="all">Todas las categorías</option>`;
    categorias.forEach(c => {
      const option = document.createElement("option");
      option.value = c.nombre;
      option.textContent = c.nombre;
      categoryFilter.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando categorías:", err);
  }
}

function renderRestaurants(list) {
  container.innerHTML = "";
  list.forEach(r => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${r.imagen}" alt="${r.nombre}">
      <div class="card-content">
        <h3>${r.nombre}</h3>
        <p>${r.ubicacion || ""}</p>
        <div class="stars">${"★".repeat(Math.round(r.popularidad))}${"☆".repeat(5 - Math.round(r.popularidad))}</div>
        <button class="btn-vermas" data-id="${r._id}">Ver más</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".btn-vermas").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.currentTarget.dataset.id;
      const restaurant = listaRestaurantes.find(x => x._id === id);
      if (restaurant) openDetail(restaurant);
    });
  });
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const ranking = rankingFilter.value;

  const filtered = listaRestaurantes.filter(r => {
    const matchesSearch = r.nombre.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || r.categoria_info.nombre === category;
    const matchesRanking = ranking === "all" || Math.round(r.popularidad) == ranking;
    return matchesSearch && matchesCategory && matchesRanking;
  });

  renderRestaurants(filtered);
}

function openDetail(restaurant) {
  detailName.textContent = restaurant.nombre;
  detailImage.src = restaurant.imagen;
  detailDescription.textContent = restaurant.descripcion || "Sin descripción disponible";
  detailLocation.textContent = restaurant.ubicacion || "";
  detailStars.innerHTML = "★".repeat(Math.round(restaurant.popularidad)) + "☆".repeat(5 - Math.round(restaurant.popularidad));
  detailScore.textContent = restaurant.popularidad?.toFixed(1) || "0.0";

  const reseñasDelRestaurante = listaReseñas.filter(r => r.restaurante === restaurant._id);
  reviewsList.innerHTML = "";
if (reseñasDelRestaurante.length > 0) {
  reseñasDelRestaurante.forEach(r => {
    const rev = document.createElement("div");
    rev.classList.add("review");
    rev.innerHTML = `
      <div class="review-author">${r.usuario_info && r.usuario_info.nombre ? r.usuario_info.nombre : "Anónimo"}</div>
      <div class="review-text">${r.comentario || ""}</div>
      <div class="review-meta">
        <div class="review-rating">${"★".repeat(r.calificacion)}${"☆".repeat(5 - r.calificacion)}</div>
      </div>
    `;
    reviewsList.appendChild(rev);
  });
} else {
  reviewsList.innerHTML = `<div class="no-reviews">Aún no hay reseñas para este restaurante.</div>`;
}

  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.style.display = "none";
  document.body.style.overflow = "";
}
