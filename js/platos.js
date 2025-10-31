// ==========================
// VARIABLES GLOBALES
// ==========================
const platesContainer = document.getElementById("platesContainer");
const searchInput = document.getElementById("searchInput");
const restaurantFilter = document.getElementById("restaurantFilter");

let listaPlatos = [];
let listaRestaurantes = [];

// ==========================
// CARGA INICIAL
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  await obtenerRestaurantes();
  await obtenerPlatos();
  llenarRestaurantFilter();
  renderPlates(listaPlatos);

  searchInput.addEventListener("input", applyFilters);
  restaurantFilter.addEventListener("change", applyFilters);
});

// ==========================
// FETCH
// ==========================
async function obtenerPlatos() {
  try {
    const resp = await fetch("http://localhost:4000/platos");
    if (!resp.ok) throw new Error("Error al obtener platos");
    listaPlatos = await resp.json();
  } catch (error) {
    console.error("❌ Error GET platos:", error);
  }
}

async function obtenerRestaurantes() {
  try {
    const resp = await fetch("http://localhost:4000/restaurantes");
    if (!resp.ok) throw new Error("Error al obtener restaurantes");
    listaRestaurantes = await resp.json();
  } catch (error) {
    console.error("❌ Error GET restaurantes:", error);
  }
}

// ==========================
// RENDER DE PLATOS
// ==========================
function renderPlates(list) {
  platesContainer.innerHTML = "";
  if(list.length === 0){
    platesContainer.innerHTML = "<p>No se encontraron platos.</p>";
    return;
  }
  list.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("plate-card");
    const restaurante = listaRestaurantes.find(r => r._id === p.restaurante);
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" />
      <div class="plate-content">
        <h3>${p.nombre}</h3>
        <p><strong>Restaurante:</strong> ${restaurante ? restaurante.nombre : "Desconocido"}</p>
        <p>${p.descripcion}</p>
        <p><strong>Precio:</strong> $${p.precio}</p>
      </div>
    `;
    platesContainer.appendChild(card);
  });
}

// ==========================
// FILTROS
// ==========================
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const restaurantId = restaurantFilter.value;

  const filtered = listaPlatos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm) || p.descripcion.toLowerCase().includes(searchTerm);
    const matchesRestaurant = restaurantId === "all" || p.restaurante === restaurantId;
    return matchesSearch && matchesRestaurant;
  });

  renderPlates(filtered);
}

// ==========================
// FILTRO DE RESTAURANTES
// ==========================
function llenarRestaurantFilter() {
  restaurantFilter.innerHTML = '<option value="all">Todos los restaurantes</option>';
  listaRestaurantes.forEach(r => {
    const option = document.createElement("option");
    option.value = r._id;
    option.textContent = r.nombre;
    restaurantFilter.appendChild(option);
  });
}

// ==========================
// LOGIN SIMULADO
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const name = prompt("Ingresa tu nombre para simular login:");
      if (name) alert(`Hola, ${name}! (login simulado)`);
    });
  }
});
