// ==========================
// VARIABLES GLOBALES
// ==========================
const container = document.getElementById("restaurantsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const rankingFilter = document.getElementById("rankingFilter");

// Modal elements
const modalOverlay = document.getElementById("modal-overlay");
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

// ==========================
// CARGA INICIAL
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  await obtenerRestaurantes();
  await obtenerReseñas();

  renderRestaurants(listaRestaurantes);

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  rankingFilter.addEventListener("change", applyFilters);
});

// ==========================
// FUNCIONES FETCH
// ==========================
async function obtenerRestaurantes() {
  try {
    const respuesta = await fetch("http://localhost:4000/restaurantes");
    if (!respuesta.ok) throw new Error("Error al obtener los restaurantes");

    const data = await respuesta.json();
    listaRestaurantes = data;

    console.log("✅ Restaurantes obtenidos:", listaRestaurantes);
  } catch (error) {
    console.error("❌ Hubo un problema con la solicitud GET de restaurantes:", error);
  }
}

async function obtenerReseñas() {
  try {
    const respuesta = await fetch("http://localhost:4000/resenias");
    if (!respuesta.ok) throw new Error("Error al obtener las reseñas");

    const data = await respuesta.json();
    listaReseñas = data;

    console.log("✅ Reseñas obtenidas:", listaReseñas);
  } catch (error) {
    console.error("❌ Hubo un problema con la solicitud GET de reseñas:", error);
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
        <p>${r.ubicacion}</p>
        <p>${r.categoria_info.nombre}</p>
        <div class="stars">${"★".repeat(Math.round(r.popularidad))}${"☆".repeat(5 - Math.round(r.popularidad))}</div>
        <div class="card-actions" style="margin-top:0.8rem;">
          <button class="btn-vermas" data-id="${r._id}">Ver más</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });


  document.querySelectorAll(".btn-vermas").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const restaurant = listaRestaurantes.find(x => x._id === id);
      if (restaurant) openDetail(restaurant);
    });
  });
}

async function llenarCategorias() {
  try {
    const respuesta = await fetch("http://localhost:4000/categorias"); 
    if (!respuesta.ok) throw new Error("Error al obtener categorías");

    const categorias = await respuesta.json(); 

    const categoryFilter = document.getElementById("categoryFilter");

    categoryFilter.innerHTML = `<option value="all">Todas las categorías</option>`;

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.nombre;  
      option.textContent = cat.nombre;
      categoryFilter.appendChild(option);
    });

  } catch (error) {
    console.error("❌ Hubo un problema al cargar las categorías:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  llenarCategorias();
});


function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const ranking = rankingFilter.value;

  const filtered = listaRestaurantes.filter(r => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchTerm) ||
      (r.ubicacion && r.ubicacion.toLowerCase().includes(searchTerm));
    const matchesCategory = category === "all" || r.categoria_info.nombre === category;
    const matchesRanking = ranking === "all" || Math.round(r.popularidad) == ranking;
    return matchesSearch && matchesCategory && matchesRanking;
  });

  renderRestaurants(filtered);
}

function openDetail(restaurant) {

  detailName.textContent = restaurant.nombre;
  detailImage.src = restaurant.imagen;
  detailImage.alt = restaurant.nombre;
  detailDescription.textContent = restaurant.descripcion || "Sin descripción disponible";
  detailLocation.textContent = restaurant.ubicacion ? `📍 ${restaurant.ubicacion}` : "";
  detailStars.innerHTML = `${"★".repeat(Math.round(restaurant.popularidad))}${"☆".repeat(5 - Math.round(restaurant.popularidad))}`;


  const reseñasDelRestaurante = listaReseñas.filter(r => r.restaurante === restaurant._id);

  if (reseñasDelRestaurante.length > 0) {
    const promedio = reseñasDelRestaurante.reduce((acc, r) => acc + r.calificacion, 0) / reseñasDelRestaurante.length;
    detailScore.textContent = promedio.toFixed(1);
  } else {
    detailScore.textContent = restaurant.popularidad?.toFixed(1) || "0.0";
  }


  reviewsList.innerHTML = "";
  if (reseñasDelRestaurante.length > 0) {
    reseñasDelRestaurante.forEach(r => {
      const rev = document.createElement("div");
      rev.classList.add("review");
      rev.innerHTML = `
        <div class="review-author"><strong>${r.usuario_info.nombre || "Anónimo"}</strong></div>
        <div class="review-text">${r.comentario || ""}</div>
        <div class="review-meta">
          <div class="review-rating">${"★".repeat(r.calificacion)}${"☆".repeat(5 - r.calificacion)}</div>
          <div class="review-score">${r.calificacion}.0</div>
        </div>
      `;
      reviewsList.appendChild(rev);
    });
  } else {
    reviewsList.innerHTML = `<div class="no-reviews">Aún no hay reseñas para este restaurante.</div>`;
  }

  modalOverlay.style.display = "flex";
  modalOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.style.display = "none";
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}


