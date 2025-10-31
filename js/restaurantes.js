// Datos (agregué campo 'location' y 'reviews' para la vista detalle)
const restaurants = [
  {
    id: 1,
    name: "Sabor Urbano",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    description: "Cocina fusión moderna con ingredientes locales.",
    rating: 4,
    category: "Gourmet",
    location: "Calle 45 #12-34, Ciudad",
    reviews: [
      { author: "María Sanchez", text: "Excelente restaurante, la comida deliciosa y la atención fue muy buena.", rating: 5 },
      { author: "Camila Santos", text: "Probé la pizza recomendada por el chef, estuvo muy buena; la demora en el servicio fue un poco larga.", rating: 4 }
    ]
  },
  {
    id: 2,
    name: "La Tavola Italiana",
    img: "https://la-tavola.com/wp-content/uploads/2021/01/IMG_1603-cropped.jpg",
    description: "Auténtica comida italiana con ambiente familiar.",
    rating: 5,
    category: "Gourmet",
    location: "Av. Italia 200, Centro",
    reviews: [
      { author: "Pedro López", text: "Las pastas son como en casa. Recomiendo la lasaña.", rating: 5 }
    ]
  },
  {
    id: 3,
    name: "Veggie Life",
    img: "https://tse4.mm.bing.net/th/id/OIP.jDyMR-slevZAjStNAE-pxAHaE8?w=1000&h=668&rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Especialidad en platos vegetarianos y smoothies.",
    rating: 4,
    category: "Vegetariana",
    location: "Parque Verde 9",
    reviews: []
  },
  {
    id: 4,
    name: "Bamboo Asian",
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    description: "Sabores del oriente en un solo lugar.",
    rating: 5,
    category: "Asiática",
    location: "Calle del Sol 78",
    reviews: [
      { author: "Luis Pérez", text: "Excelente sushi y atención rápida.", rating: 5 },
      { author: "Ana Gómez", text: "Buena relación calidad-precio.", rating: 4 }
    ]
  },
  {
    id: 5,
    name: "Burger Spot",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    description: "Las hamburguesas más jugosas de la ciudad.",
    rating: 3,
    category: "Fast Food",
    location: "Av. Central 50",
    reviews: [
      { author: "Carlos Ruiz", text: "Hamburguesa jugosa pero tardaron mucho.", rating: 3 }
    ]
  }
  // ... puedes añadir más objetos con el mismo formato
];

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

// Render inicial
renderRestaurants(restaurants);

// Función para mostrar los restaurantes
function renderRestaurants(list) {
  container.innerHTML = "";
  list.forEach(r => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${r.img}" alt="${r.name}">
      <div class="card-content">
        <h3>${r.name}</h3>
        <p>${r.description}</p>
        <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <div class="card-actions" style="margin-top:0.8rem;">
          <button class="btn-vermas" data-id="${r.id}">Ver más</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // after cards are in DOM, attach listeners to "Ver más"
  document.querySelectorAll(".btn-vermas").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const restaurant = restaurants.find(x => x.id === id);
      if (restaurant) openDetail(restaurant);
    });
  });
}

// Filtro dinamico
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const ranking = rankingFilter.value;

  const filtered = restaurants.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm) ||
      (r.description && r.description.toLowerCase().includes(searchTerm));
    const matchesCategory = category === "all" || r.category === category;
    const matchesRanking = ranking === "all" || r.rating == ranking;
    return matchesSearch && matchesCategory && matchesRanking;
  });

  renderRestaurants(filtered);
}

// Eventos de filtro
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
rankingFilter.addEventListener("change", applyFilters);

/* ---------- Modal / Vista detalle ---------- */

function openDetail(restaurant) {
  // rellenar datos
  detailName.textContent = restaurant.name;
  detailImage.src = restaurant.img;
  detailImage.alt = restaurant.name;
  detailDescription.textContent = restaurant.description || "";
  detailLocation.textContent = restaurant.location ? `Ubicación: ${restaurant.location}` : "";
  detailStars.innerHTML = `${"★".repeat(restaurant.rating)}${"☆".repeat(5 - restaurant.rating)}`;
  detailScore.textContent = computeAverageScore(restaurant).toFixed(1);

  // reviews
  reviewsList.innerHTML = "";
  if (restaurant.reviews && restaurant.reviews.length) {
    restaurant.reviews.forEach(r => {
      const rev = document.createElement("div");
      rev.classList.add("review");
      rev.innerHTML = `
        <div class="review-author">${r.author}</div>
        <div class="review-text">${r.text}</div>
        <div class="review-meta">
          <div class="review-rating">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
          <div class="review-score">${r.rating}.0</div>
        </div>
      `;
      reviewsList.appendChild(rev);
    });
  } else {
    reviewsList.innerHTML = `<div class="no-reviews">Aún no hay reseñas para este restaurante.</div>`;
  }

  // mostrar modal
  modalOverlay.style.display = "flex";
  modalOverlay.setAttribute("aria-hidden", "false");
  // evitar scroll del body
  document.body.style.overflow = "hidden";
}

function computeAverageScore(restaurant) {
  if (!restaurant.reviews || restaurant.reviews.length === 0) return restaurant.rating || 0;
  const sum = restaurant.reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / restaurant.reviews.length;
}

// cerrar modal
modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.style.display = "none";
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ---------- Login modal (tu código anterior esperaba modal-overlay) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");

  // Nota: ya usamos modal-overlay para la vista detalle; aquí asumo que
  // el login hace otra cosa. Si quieres que login abra otro modal, hay que crear otro overlay.
  loginBtn.addEventListener("click", () => {
    // Por ahora lo reutilizamos para demo: mostrar un prompt simple o abrir la vista detalle vacía.
    // Mejor: mostrar un alert o tu modal real si lo tienes separado.
    const name = prompt("Ingresa tu nombre para simular login:");
    if (name) alert(`Hola, ${name}! (login simulado)`);
  });
});


