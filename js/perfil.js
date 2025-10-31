document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    username: "Andresitogai1234",
    email: "Andresitogai1234@gmail.com",
    reviews: 3,
    reseñas: [
      {
        restaurante: "Pizza Lovers",
        texto: "Excelente masa y servicio rápido.",
        rating: 5,
      },
      {
        restaurante: "Sabores del Mundo",
        texto: "Buena variedad, aunque algo costoso.",
        rating: 4,
      },
      {
        restaurante: "Veggie Life",
        texto: "Muy saludable, pero podría mejorar la presentación.",
        rating: 3,
      },
    ],
  };

  // Cargar datos de perfil
  document.getElementById("userName").textContent = userData.username;
  document.getElementById("username").value = userData.username;
  document.getElementById("correo").value = userData.email;
  document.getElementById("reviewCount").textContent = userData.reviews;

  // Guardar perfil
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", () => {
    alert("Cambios guardados correctamente ✅");
  });

  // Manejo de botones del sidebar
  const buttons = document.querySelectorAll(".menu-btn");
  const sections = document.querySelectorAll(".section");

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // Cambiar estado activo del botón
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Mostrar la sección correspondiente
      sections.forEach((sec) => sec.classList.add("hidden"));
      sections[index].classList.remove("hidden");
      sections[index].classList.add("active");

      // Si es el botón de reseñas, renderizar reseñas
      if (btn.textContent.includes("reseñas")) {
        renderReseñas(userData.reseñas);
      }
    });
  });

  // Renderizar reseñas del usuario
  function renderReseñas(reseñas) {
    const contenedor = document.getElementById("reseñasContainer");
    contenedor.innerHTML = "";

    if (reseñas.length === 0) {
      contenedor.innerHTML = `<p>No has dejado reseñas todavía 🍽️</p>`;
      return;
    }

    reseñas.forEach((r) => {
      const div = document.createElement("div");
      div.classList.add("reseña-card");
      div.innerHTML = `
        <h4>${r.restaurante}</h4>
        <p>${r.texto}</p>
        <div class="rating">${"⭐".repeat(r.rating)}</div>
      `;
      contenedor.appendChild(div);
    });
  }
});
