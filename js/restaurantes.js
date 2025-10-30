const restaurants = [
  {
    name: "Sabor Urbano",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    description: "Cocina fusión moderna con ingredientes locales.",
    rating: 4,
    category: "Gourmet"
  },
  {
    name: "La Tavola Italiana",
    img: "https://la-tavola.com/wp-content/uploads/2021/01/IMG_1603-cropped.jpg",
    description: "Auténtica comida italiana con ambiente familiar.",
    rating: 5,
    category: "Gourmet"
  },
  {
    name: "Veggie Life",
    img: "https://tse4.mm.bing.net/th/id/OIP.jDyMR-slevZAjStNAE-pxAHaE8?w=1000&h=668&rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Especialidad en platos vegetarianos y smoothies.",
    rating: 4,
    category: "Vegetariana"
  },
  {
    name: "Bamboo Asian",
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    description: "Sabores del oriente en un solo lugar.",
    rating: 5,
    category: "Asiática"
  },
  {
    name: "Burger Spot",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    description: "Las hamburguesas más jugosas de la ciudad.",
    rating: 3,
    category: "Fast Food"
  }
];

const container = document.getElementById("restaurantsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const rankingFilter = document.getElementById("rankingFilter");

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
      </div>
    `;
    container.appendChild(card);
  });
}

// Filtro dinamico
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const ranking = rankingFilter.value;

  const filtered = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm);
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
